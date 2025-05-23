import { describe, expect, it } from 'vitest';
import validators from './validators';

describe('validators', () => {
  describe('isValidString', () => {
    it('should return error for empty value', () => {
      expect(validators.isValidString('  ')).toBe('This field is required');
    });

    it('should return undefined for a valid value', () => {
      expect(validators.isValidString('hello')).toBeUndefined();
    });
  });

  describe('isValidEmail', () => {
    it('should return error for empty value', () => {
      expect(validators.isValidEmail('')).toBe('This field is required');
    });

    it('should return error for invalid value', () => {
      expect(validators.isValidEmail('test')).toBe('This is not a valid email address');
    });

    it('should return undefined for a valid value', () => {
      expect(validators.isValidEmail('test@test.com')).toBeUndefined();
    });
  });

  describe('isValidPhoneNumber', () => {
    it('should return undefined for empty value', () => {
      expect(validators.isValidPhoneNumber('')).toBeUndefined();
    });

    it('should return error for invalid value', () => {
      expect(validators.isValidPhoneNumber('123')).toBe('This is not a valid phone number');
    });

    it('should return undefined for a valid value', () => {
      expect(validators.isValidPhoneNumber('+1-214-555-7294')).toBeUndefined();
    });
  });
});