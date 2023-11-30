import { binarySearch } from './binarySearch';
import { buildComparator } from './comparator';

describe('binarySearch:module', () => {
  describe('binarySearch', () => {
    let start = -1;
    let end = -1;
    const NUMS = [0, 1, 3, 4, 5];

    const comparator = buildComparator({
      gt: (t: number, v: number) => t > v,
      order: 'desc',
    });

    const search = (num: number) =>
      binarySearch(NUMS, num, comparator, p => {
        start = p.start;
        end = p.end;
      });

    beforeEach(() => {
      start = -1;
      end = -1;
    });

    it('-1', () => {
      expect(search(-1)).toBe(-1);
      expect([start, end]).toEqual([0, -1]);
    });

    it('0', () => {
      expect(search(0)).toBe(0);
      expect([start, end]).toEqual([0, 1]);
    });

    it('1', () => {
      expect(search(1)).toBe(1);
      expect([start, end]).toEqual([1, 1]);
    });

    it('2', () => {
      expect(search(2)).toBe(-1);
      expect([start, end]).toEqual([2, 1]);
    });

    it('3', () => {
      expect(search(3)).toBe(2);
      expect([start, end]).toEqual([0, 4]);
    });

    it('4', () => {
      expect(search(4)).toBe(3);
      expect([start, end]).toEqual([3, 4]);
    });

    it('5', () => {
      expect(search(5)).toBe(4);
      expect([start, end]).toEqual([4, 4]);
    });
    it('6', () => {
      expect(search(6)).toBe(-1);
      expect([start, end]).toEqual([5, 4]);
    });
  });
});
