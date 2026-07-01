import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../database/supabase.module';
import { RegistrationsService } from './registrations.service';
import { PromoCodesService } from '../promo-codes/promo-codes.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';

describe('RegistrationsService', () => {
  let service: RegistrationsService;
  let mockSupabase: jest.Mocked<SupabaseClient>;
  let mockPromoCodesService: jest.Mocked<PromoCodesService>;
  let mockConfigService: jest.Mocked<ConfigService>;

  beforeEach(async () => {
    // Mock Supabase methods
    const fromMock = jest.fn();
    mockSupabase = {
      from: fromMock,
    } as unknown as jest.Mocked<SupabaseClient>;

    // Mock PromoCodesService
    mockPromoCodesService = {
      applyCode: jest.fn(),
    } as unknown as jest.Mocked<PromoCodesService>;

    // Mock ConfigService
    mockConfigService = {
      get: jest.fn().mockReturnValue('https://mock-lark-webhook-url.com'),
    } as unknown as jest.Mocked<ConfigService>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegistrationsService,
        {
          provide: SUPABASE_CLIENT,
          useValue: mockSupabase,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: PromoCodesService,
          useValue: mockPromoCodesService,
        },
      ],
    }).compile();

    service = module.get<RegistrationsService>(RegistrationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create registration (individual)', () => {
    const mockCourse = {
      id: 'course-123',
      title: 'Khóa học AI Pro',
      status: 'upcoming',
      price: 1000000,
      price_group: 800000,
    };

    const mockDto: CreateRegistrationDto = {
      courseId: 'course-123',
      fullName: 'Nguyễn Văn A',
      phone: '0987654321',
      email: 'a@gmail.com',
      referral: 'Facebook',
      plan: 'individual',
    };

    it('should throw NotFoundException if course does not exist', async () => {
      // Mock Supabase course query to return null
      const mockSingle = jest.fn().mockResolvedValue({ data: null, error: new Error('Not found') });
      const mockEq = jest.fn().mockReturnValue({ single: mockSingle });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
      (mockSupabase.from as jest.Mock).mockReturnValue({ select: mockSelect });

      await expect(service.create(mockDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if course is not upcoming', async () => {
      const inactiveCourse = { ...mockCourse, status: 'closed' };
      const mockSingle = jest.fn().mockResolvedValue({ data: inactiveCourse, error: null });
      const mockEq = jest.fn().mockReturnValue({ single: mockSingle });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
      (mockSupabase.from as jest.Mock).mockReturnValue({ select: mockSelect });

      await expect(service.create(mockDto)).rejects.toThrow(BadRequestException);
    });

    it('should register successfully without promo code', async () => {
      // 1. Mock course query
      const mockSingleCourse = jest.fn().mockResolvedValue({ data: mockCourse, error: null });
      const mockEqCourse = jest.fn().mockReturnValue({ single: mockSingleCourse });
      const mockSelectCourse = jest.fn().mockReturnValue({ eq: mockEqCourse });

      // 2. Mock registration insertion
      const mockRegistrationData = { id: 'reg-999', created_at: '2026-07-01T00:00:00Z' };
      const mockSingleReg = jest.fn().mockResolvedValue({ data: mockRegistrationData, error: null });
      const mockSelectReg = jest.fn().mockReturnValue({ single: mockSingleReg });
      const mockInsertReg = jest.fn().mockReturnValue({ select: mockSelectReg });

      // Mock from() to route requests correctly
      (mockSupabase.from as jest.Mock).mockImplementation((table: string) => {
        if (table === 'courses') {
          return { select: mockSelectCourse };
        }
        if (table === 'registrations') {
          return { insert: mockInsertReg };
        }
        return {};
      });

      // Mock fetch global for Lark notification
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        text: jest.fn().mockResolvedValue('ok'),
      });

      const result = await service.create(mockDto);

      expect(result).toBeDefined();
      expect(result.id).toBe('reg-999');
      expect(result.discountAmount).toBe(0);
      expect(mockPromoCodesService.applyCode).not.toHaveBeenCalled();
    });

    it('should apply discount percent successfully with valid promo code', async () => {
      // 1. Mock course query
      const mockSingleCourse = jest.fn().mockResolvedValue({ data: mockCourse, error: null });
      const mockEqCourse = jest.fn().mockReturnValue({ single: mockSingleCourse });
      const mockSelectCourse = jest.fn().mockReturnValue({ eq: mockEqCourse });

      // 2. Mock registration insertion
      const mockRegistrationData = { id: 'reg-999', created_at: '2026-07-01T00:00:00Z' };
      const mockSingleReg = jest.fn().mockResolvedValue({ data: mockRegistrationData, error: null });
      const mockSelectReg = jest.fn().mockReturnValue({ single: mockSingleReg });
      const mockInsertReg = jest.fn().mockReturnValue({ select: mockSelectReg });

      (mockSupabase.from as jest.Mock).mockImplementation((table: string) => {
        if (table === 'courses') {
          return { select: mockSelectCourse };
        }
        if (table === 'registrations') {
          return { insert: mockInsertReg };
        }
        return {};
      });

      // 3. Mock promo code service returning 20% discount
      mockPromoCodesService.applyCode.mockResolvedValue({
        valid: true,
        message: 'Giảm 20% học phí',
        discount_type: 'percent',
        discount_value: 20,
        promo_code_id: 'promo-111',
      });

      const dtoWithPromo: CreateRegistrationDto = {
        ...mockDto,
        promoCode: 'AIZEN20',
      };

      const result = await service.create(dtoWithPromo);

      expect(mockPromoCodesService.applyCode).toHaveBeenCalledWith('AIZEN20', 'course-123', 'individual');
      expect(result.discountAmount).toBe(200000); // 20% of 1,000,000 = 200,000
    });

    it('should throw BadRequestException if applied promo code is invalid', async () => {
      // Mock course query
      const mockSingleCourse = jest.fn().mockResolvedValue({ data: mockCourse, error: null });
      const mockEqCourse = jest.fn().mockReturnValue({ single: mockSingleCourse });
      const mockSelectCourse = jest.fn().mockReturnValue({ eq: mockEqCourse });
      (mockSupabase.from as jest.Mock).mockImplementation((table: string) => {
        if (table === 'courses') return { select: mockSelectCourse };
        return {};
      });

      // Mock promo code service returning invalid result
      mockPromoCodesService.applyCode.mockResolvedValue({
        valid: false,
        message: 'Mã khuyến mãi đã hết hạn',
      });

      const dtoWithPromo: CreateRegistrationDto = {
        ...mockDto,
        promoCode: 'EXPIRED',
      };

      await expect(service.create(dtoWithPromo)).rejects.toThrow(BadRequestException);
    });
  });
});
