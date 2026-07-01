import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CLIENT } from '../../database/supabase.module';
import { PromoCodesService } from './promo-codes.service';
import { CreatePromoCodeDto } from './dto/create-promo-code.dto';

describe('PromoCodesService', () => {
  let service: PromoCodesService;
  let mockSupabase: jest.Mocked<SupabaseClient>;

  beforeEach(async () => {
    const fromMock = jest.fn();
    mockSupabase = {
      from: fromMock,
      rpc: jest.fn(),
    } as unknown as jest.Mocked<SupabaseClient>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PromoCodesService,
        {
          provide: SUPABASE_CLIENT,
          useValue: mockSupabase,
        },
      ],
    }).compile();

    service = module.get<PromoCodesService>(PromoCodesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('adminCreate', () => {
    const mockDto: CreatePromoCodeDto = {
      code: 'AIZEN50',
      course_id: 'course-123',
      plan: 'all',
      discount_type: 'percent',
      discount_value: 50,
      max_uses: 10,
      note: 'Test discount',
    };

    it('should throw ConflictException if promo code already exists', async () => {
      // Mock code lookup to return an existing record
      const mockMaybeSingle = jest.fn().mockResolvedValue({ data: { id: 'existing-id' }, error: null });
      const mockEq = jest.fn().mockReturnValue({ maybeSingle: mockMaybeSingle });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
      (mockSupabase.from as jest.Mock).mockReturnValue({ select: mockSelect });

      await expect(service.adminCreate(mockDto)).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException if course does not exist', async () => {
      // Mock first lookup (code does not exist)
      const mockMaybeSingleCode = jest.fn().mockResolvedValue({ data: null, error: null });
      const mockEqCode = jest.fn().mockReturnValue({ maybeSingle: mockMaybeSingleCode });
      const mockSelectCode = jest.fn().mockReturnValue({ eq: mockEqCode });

      // Mock second lookup (course does not exist)
      const mockMaybeSingleCourse = jest.fn().mockResolvedValue({ data: null, error: null });
      const mockEqCourse = jest.fn().mockReturnValue({ maybeSingle: mockMaybeSingleCourse });
      const mockSelectCourse = jest.fn().mockReturnValue({ eq: mockEqCourse });

      (mockSupabase.from as jest.Mock).mockImplementation((table: string) => {
        if (table === 'promo_codes') return { select: mockSelectCode };
        if (table === 'courses') return { select: mockSelectCourse };
        return {};
      });

      await expect(service.adminCreate(mockDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('validate (preview validation)', () => {
    const mockPromo = {
      id: 'promo-123',
      code: 'AIZEN50',
      course_id: 'course-123',
      plan: 'individual',
      discount_type: 'percent',
      discount_value: 50,
      max_uses: 10,
      used_count: 2,
      expires_at: null,
      is_active: true,
    };

    it('should return valid if code is applicable', async () => {
      const mockMaybeSingle = jest.fn().mockResolvedValue({ data: mockPromo, error: null });
      const mockEq = jest.fn().mockReturnValue({ maybeSingle: mockMaybeSingle });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
      (mockSupabase.from as jest.Mock).mockReturnValue({ select: mockSelect });

      const result = await service.validate('AIZEN50', 'course-123', 'individual');

      expect(result.valid).toBe(true);
      expect(result.discount_type).toBe('percent');
      expect(result.discount_value).toBe(50);
      expect(result.promo_code_id).toBe('promo-123');
    });

    it('should return invalid if plan does not match', async () => {
      const mockMaybeSingle = jest.fn().mockResolvedValue({ data: mockPromo, error: null });
      const mockEq = jest.fn().mockReturnValue({ maybeSingle: mockMaybeSingle });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
      (mockSupabase.from as jest.Mock).mockReturnValue({ select: mockSelect });

      const result = await service.validate('AIZEN50', 'course-123', 'group');

      expect(result.valid).toBe(false);
      expect(result.message).toContain('chỉ áp dụng cho đăng ký cá nhân');
    });

    it('should return invalid if code is expired', async () => {
      const expiredPromo = {
        ...mockPromo,
        expires_at: '2020-01-01T00:00:00Z',
      };
      const mockMaybeSingle = jest.fn().mockResolvedValue({ data: expiredPromo, error: null });
      const mockEq = jest.fn().mockReturnValue({ maybeSingle: mockMaybeSingle });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
      (mockSupabase.from as jest.Mock).mockReturnValue({ select: mockSelect });

      const result = await service.validate('AIZEN50', 'course-123', 'individual');

      expect(result.valid).toBe(false);
      expect(result.message).toContain('đã hết hạn');
    });

    it('should return invalid if limit reached', async () => {
      const maxedPromo = {
        ...mockPromo,
        used_count: 10,
        max_uses: 10,
      };
      const mockMaybeSingle = jest.fn().mockResolvedValue({ data: maxedPromo, error: null });
      const mockEq = jest.fn().mockReturnValue({ maybeSingle: mockMaybeSingle });
      const mockSelect = jest.fn().mockReturnValue({ eq: mockEq });
      (mockSupabase.from as jest.Mock).mockReturnValue({ select: mockSelect });

      const result = await service.validate('AIZEN50', 'course-123', 'individual');

      expect(result.valid).toBe(false);
      expect(result.message).toContain('hết lượt sử dụng');
    });
  });
});
