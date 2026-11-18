import { describe, expect, it } from 'vitest';
import { FIRMS, getFirmForChallan } from '@/config/firms';

describe('firm configuration and assignment', () => {
  it('correctly maps PC bills to Parth Fuel Corporation', () => {
    expect(getFirmForChallan('PC/245')).toEqual(FIRMS.parth);
    expect(getFirmForChallan('pc/101')).toEqual(FIRMS.parth);
    expect(getFirmForChallan('245')).toEqual(FIRMS.parth);
    expect(getFirmForChallan(null)).toEqual(FIRMS.parth);
  });

  it('correctly maps AT bills to Aarav Traders', () => {
    expect(getFirmForChallan('AT/1')).toEqual(FIRMS.aarav);
    expect(getFirmForChallan('at/50')).toEqual(FIRMS.aarav);
    expect(getFirmForChallan('AT-12')).toEqual(FIRMS.aarav);
  });

  it('has valid GST and address configurations for both firms', () => {
    expect(FIRMS.parth.gstNo).toContain('27AREPM6726C1ZV');
    expect(FIRMS.aarav.gstNo).toContain('27AKIPM5661P1ZE');
    expect(FIRMS.aarav.address).toContain('APMC MARKET');
    expect(FIRMS.aarav.headerTitle).toBe('AARAV TRADERS');
  });
});

