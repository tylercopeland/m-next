import { compact, DynamicData, CompactionItemIn } from './compact';

describe('Compaction Algorithm Performance', () => {
  it.skip('performance test with combined test data', () => {
    const base: CompactionItemIn[] = [
      // 1 (max h: 1, acc: 1)
      { id: 'a_1', x: 0, y: 0 + 1, w: 1, h: 1, hidden: false },
      // 2 (max h: 1, acc: 2)
      { id: 'a_2', x: 0, y: 0 + 2, w: 1, h: 1, hidden: false },
      // 3 (max h: 2, acc: 4)
      { id: 'a_3', x: 0, y: 0 + 4, w: 1, h: 2, hidden: false },
      // 4 (max h: 1, acc: 5)
      { id: 'a_4', x: 0, y: 0 + 5, w: 1, h: 1, hidden: false },
      { id: 'b_4', x: 0, y: 1 + 5, w: 1, h: 1, hidden: false },
      { id: 'c_4', x: 1, y: 1 + 5, w: 1, h: 1, hidden: false },
      // 5 (max h: 1, acc: 6)
      { id: 'a_5', x: 0, y: 0 + 6, w: 1, h: 1, hidden: false },
      { id: 'b_5', x: 1, y: 1 + 6, w: 1, h: 1, hidden: false },
      // 6 (max h: 1, acc: 7)
      { id: 'a_6', x: 0, y: 0 + 7, w: 1, h: 1, hidden: false },
      { id: 'b_6', x: 1, y: 0 + 7, w: 1, h: 1, hidden: false },
      { id: 'c_6', x: 1, y: 1 + 7, w: 2, h: 1, hidden: false },
      // 7 (max h: 2, acc: 9)
      { id: 'a_7', x: 0, y: 0 + 9, w: 1, h: 1, hidden: false },
      { id: 'b_7', x: 1, y: 0 + 9, w: 1, h: 1, hidden: false },
      { id: 'c_7', x: 0, y: 1 + 9, w: 2, h: 2, hidden: false },
      // 8 (max h: 1, acc: 10)
      { id: 'a_8', x: 0, y: 0 + 10, w: 1, h: 1, hidden: false },
      { id: 'b_8', x: 0, y: 1 + 10, w: 1, h: 1, hidden: false },
      { id: 'c_8', x: 0, y: 2 + 10, w: 1, h: 1, hidden: false },
      // 9 (max h: 3, acc: 13)
      { id: 'a_9', x: 0, y: 0 + 13, w: 1, h: 3, hidden: false },
      { id: 'b_9', x: 1, y: 1 + 13, w: 1, h: 1, hidden: false },
      { id: 'c_9', x: 0, y: 3 + 13, w: 1, h: 1, hidden: false },
      // 10 (max h: 3, acc: 16)
      { id: 'a_10', x: 0, y: 0 + 16, w: 1, h: 1, hidden: false },
      { id: 'b_10', x: 1, y: 0 + 16, w: 1, h: 1, hidden: false },
      { id: 'c_10', x: 0, y: 1 + 16, w: 1, h: 1, hidden: false },
      { id: 'd_10', x: 1, y: 2 + 16, w: 1, h: 1, hidden: false },
      // 11 (max h: 1, acc: 17)
      { id: 'a_11', x: 0, y: 0 + 17, w: 1, h: 1, hidden: false },
      { id: 'b_11', x: 0, y: 2 + 17, w: 1, h: 1, hidden: false },
      // 12 (max h: 1, acc: 18)
      { id: 'a_12', x: 0, y: 0 + 18, w: 1, h: 1, hidden: false },
      { id: 'b_12', x: 0, y: 2 + 18, w: 1, h: 1, hidden: false },
      // 13 (max h: 1, acc: 19)
      { id: 'a_13', x: 0, y: 0 + 19, w: 1, h: 1, hidden: false },
      { id: 'b_13', x: 0, y: 2 + 19, w: 1, h: 1, hidden: false },
      { id: 'c_13', x: 0, y: 4 + 19, w: 1, h: 1, hidden: false },
      // 14 (max h: 1, acc: 20)
      { id: 'a_14', x: 0, y: 0 + 20, w: 1, h: 1, hidden: false },
      { id: 'b_14', x: 0, y: 2 + 20, w: 1, h: 1, hidden: false },
      // 15 (max h: 1, acc: 21)
      { id: 'a_15', x: 0, y: 0 + 21, w: 1, h: 1, hidden: true },
      // 16 (max h: 1, acc: 22)
      { id: 'a_16', x: 0, y: 0 + 22, w: 1, h: 1, hidden: true },
      // 17 (max h: 1, acc: 23)
      { id: 'a_17', x: 0, y: 0 + 23, w: 1, h: 1, hidden: true },
      { id: 'b_17', x: 1, y: 0 + 23, w: 1, h: 1, hidden: true },
      // 18 (max h: 1, acc: 24)
      { id: 'a_18', x: 0, y: 0 + 24, w: 1, h: 1, hidden: false },
      { id: 'b_18', x: 0, y: 1 + 24, w: 1, h: 1, hidden: false },
      // 19 (max h: 1, acc: 25)
      { id: 'a_19', x: 0, y: 0 + 25, w: 1, h: 1, hidden: true },
      { id: 'b_19', x: 0, y: 1 + 25, w: 1, h: 1, hidden: false },
      // 20 (max h: 1, acc: 26)
      { id: 'a_20', x: 0, y: 0 + 26, w: 1, h: 1, hidden: false },
      { id: 'b_20', x: 1, y: 0 + 26, w: 1, h: 1, hidden: false },
      // 21 (max h: 1, acc: 27)
      { id: 'a_21', x: 0, y: 0 + 27, w: 1, h: 1, hidden: false },
      { id: 'b_21', x: 0, y: 1 + 27, w: 1, h: 1, hidden: false },
      { id: 'c_21', x: 2, y: 1 + 27, w: 1, h: 1, hidden: false },
      { id: 'd_21', x: 1, y: 2 + 27, w: 1, h: 1, hidden: false },
      // 22 (max h: 1, acc: 28)
      { id: 'a_22', x: 0, y: 0 + 28, w: 1, h: 1, hidden: true },
      { id: 'b_22', x: 0, y: 0 + 28, w: 1, h: 1, hidden: false },
      // 23 (max h: 1, acc: 29)
      { id: 'a_23', x: 0, y: 0 + 29, w: 1, h: 1, hidden: true },
      { id: 'b_23', x: 0, y: 0 + 29, w: 1, h: 1, hidden: true },
      // 24 (max h: 1, acc: 30)
      { id: 'a_24', x: 0, y: 0 + 30, w: 2, h: 1, hidden: false },
      { id: 'b_24', x: 2, y: 0 + 30, w: 2, h: 1, hidden: false },
      { id: 'c_24', x: 1, y: 0 + 30, w: 2, h: 1, hidden: true },
      { id: 'd_24', x: 3, y: 0 + 30, w: 2, h: 1, hidden: true },
      // 25 (max h: 2, acc: 32)
      { id: 'a_25', x: 0, y: 0 + 32, w: 2, h: 2, hidden: false },
      { id: 'b_25', x: 2, y: 0 + 32, w: 1, h: 1, hidden: true },
      { id: 'c_25', x: 1, y: 1 + 32, w: 3, h: 1, hidden: false },
      // 26 (max h: 2, acc: 34)
      { id: 'a_26', x: 0, y: 0 + 34, w: 1, h: 1, hidden: false },
      { id: 'b_26', x: 0, y: 0 + 34, w: 1, h: 2, hidden: true },
      { id: 'c_26', x: 0, y: 1 + 34, w: 1, h: 1, hidden: false },
      // 27 (max h: 3, acc: 37)
      { id: 'a_27', x: 0, y: 0 + 37, w: 3, h: 3, hidden: false },
      { id: 'b_27', x: 3, y: 1 + 37, w: 2, h: 3, hidden: false },
      { id: 'c_27', x: 1, y: 3 + 37, w: 3, h: 1, hidden: true },

      // duplicate to increase data size

      // 1 (max h: 1, acc: 1)
      { id: 'a_1_dup', x: 0, y: 0 + 1 + 40, w: 1, h: 1, hidden: false },
      // 2 (max h: 1, acc: 2)
      { id: 'a_2_dup', x: 0, y: 0 + 2 + 40, w: 1, h: 1, hidden: false },
      // 3 (max h: 2, acc: 4)
      { id: 'a_3_dup', x: 0, y: 0 + 4 + 40, w: 1, h: 2, hidden: false },
      // 4 (max h: 1, acc: 5)
      { id: 'a_4_dup', x: 0, y: 0 + 5 + 40, w: 1, h: 1, hidden: false },
      { id: 'b_4_dup', x: 0, y: 1 + 5 + 40, w: 1, h: 1, hidden: false },
      { id: 'c_4_dup', x: 1, y: 1 + 5 + 40, w: 1, h: 1, hidden: false },
      // 5 (max h: 1, acc: 6)
      { id: 'a_5_dup', x: 0, y: 0 + 6 + 40, w: 1, h: 1, hidden: false },
      { id: 'b_5_dup', x: 1, y: 1 + 6 + 40, w: 1, h: 1, hidden: false },
      // 6 (max h: 1, acc: 7)
      { id: 'a_6_dup', x: 0, y: 0 + 7 + 40, w: 1, h: 1, hidden: false },
      { id: 'b_6_dup', x: 1, y: 0 + 7 + 40, w: 1, h: 1, hidden: false },
      { id: 'c_6_dup', x: 1, y: 1 + 7 + 40, w: 2, h: 1, hidden: false },
      // 7 (max h: 2, acc: 9)
      { id: 'a_7_dup', x: 0, y: 0 + 9 + 40, w: 1, h: 1, hidden: false },
      { id: 'b_7_dup', x: 1, y: 0 + 9 + 40, w: 1, h: 1, hidden: false },
      { id: 'c_7_dup', x: 0, y: 1 + 9 + 40, w: 2, h: 2, hidden: false },
      // 8 (max h: 1, acc: 10)
      { id: 'a_8_dup', x: 0, y: 0 + 10 + 40, w: 1, h: 1, hidden: false },
      { id: 'b_8_dup', x: 0, y: 1 + 10 + 40, w: 1, h: 1, hidden: false },
      { id: 'c_8_dup', x: 0, y: 2 + 10 + 40, w: 1, h: 1, hidden: false },
      // 9 (max h: 3, acc: 13)
      { id: 'a_9_dup', x: 0, y: 0 + 13 + 40, w: 1, h: 3, hidden: false },
      { id: 'b_9_dup', x: 1, y: 1 + 13 + 40, w: 1, h: 1, hidden: false },
      { id: 'c_9_dup', x: 0, y: 3 + 13 + 40, w: 1, h: 1, hidden: false },
      // 10 (max h: 3, acc: 16)
      { id: 'a_10_dup', x: 0, y: 0 + 16 + 40, w: 1, h: 1, hidden: false },
      { id: 'b_10_dup', x: 1, y: 0 + 16 + 40, w: 1, h: 1, hidden: false },
      { id: 'c_10_dup', x: 0, y: 1 + 16 + 40, w: 1, h: 1, hidden: false },
      { id: 'd_10_dup', x: 1, y: 2 + 16 + 40, w: 1, h: 1, hidden: false },
      // 11 (max h: 1, acc: 17)
      { id: 'a_11_dup', x: 0, y: 0 + 17 + 40, w: 1, h: 1, hidden: false },
      { id: 'b_11_dup', x: 0, y: 2 + 17 + 40, w: 1, h: 1, hidden: false },
      // 12 (max h: 1, acc: 18)
      { id: 'a_12_dup', x: 0, y: 0 + 18 + 40, w: 1, h: 1, hidden: false },
      { id: 'b_12_dup', x: 0, y: 2 + 18 + 40, w: 1, h: 1, hidden: false },
      // 13 (max h: 1, acc: 19)
      { id: 'a_13_dup', x: 0, y: 0 + 19 + 40, w: 1, h: 1, hidden: false },
      { id: 'b_13_dup', x: 0, y: 2 + 19 + 40, w: 1, h: 1, hidden: false },
      { id: 'c_13_dup', x: 0, y: 4 + 19 + 40, w: 1, h: 1, hidden: false },
      // 14 (max h: 1, acc: 20)
      { id: 'a_14_dup', x: 0, y: 0 + 20 + 40, w: 1, h: 1, hidden: false },
      { id: 'b_14_dup', x: 0, y: 2 + 20 + 40, w: 1, h: 1, hidden: false },
      // 15 (max h: 1, acc: 21)
      { id: 'a_15_dup', x: 0, y: 0 + 21 + 40, w: 1, h: 1, hidden: true },
      // 16 (max h: 1, acc: 22)
      { id: 'a_16_dup', x: 0, y: 0 + 22 + 40, w: 1, h: 1, hidden: true },
      // 17 (max h: 1, acc: 23)
      { id: 'a_17_dup', x: 0, y: 0 + 23 + 40, w: 1, h: 1, hidden: true },
      { id: 'b_17_dup', x: 1, y: 0 + 23 + 40, w: 1, h: 1, hidden: true },
      // 18 (max h: 1, acc: 24)
      { id: 'a_18_dup', x: 0, y: 0 + 24 + 40, w: 1, h: 1, hidden: false },
      { id: 'b_18_dup', x: 0, y: 1 + 24 + 40, w: 1, h: 1, hidden: false },
      // 19 (max h: 1, acc: 25)
      { id: 'a_19_dup', x: 0, y: 0 + 25 + 40, w: 1, h: 1, hidden: true },
      { id: 'b_19_dup', x: 0, y: 1 + 25 + 40, w: 1, h: 1, hidden: false },
      // 20 (max h: 1, acc: 26)
      { id: 'a_20_dup', x: 0, y: 0 + 26 + 40, w: 1, h: 1, hidden: false },
      { id: 'b_20_dup', x: 1, y: 0 + 26 + 40, w: 1, h: 1, hidden: false },
      // 21 (max h: 1, acc: 27)
      { id: 'a_21_dup', x: 0, y: 0 + 27 + 40, w: 1, h: 1, hidden: false },
      { id: 'b_21_dup', x: 0, y: 1 + 27 + 40, w: 1, h: 1, hidden: false },
      { id: 'c_21_dup', x: 2, y: 1 + 27 + 40, w: 1, h: 1, hidden: false },
      { id: 'd_21_dup', x: 1, y: 2 + 27 + 40, w: 1, h: 1, hidden: false },
      // 22 (max h: 1, acc: 28)
      { id: 'a_22_dup', x: 0, y: 0 + 28 + 40, w: 1, h: 1, hidden: true },
      { id: 'b_22_dup', x: 0, y: 0 + 28 + 40, w: 1, h: 1, hidden: false },
      // 23 (max h: 1, acc: 29)
      { id: 'a_23_dup', x: 0, y: 0 + 29 + 40, w: 1, h: 1, hidden: true },
      { id: 'b_23_dup', x: 0, y: 0 + 29 + 40, w: 1, h: 1, hidden: true },
      // 24 (max h: 1, acc: 30)
      { id: 'a_24_dup', x: 0, y: 0 + 30 + 40, w: 2, h: 1, hidden: false },
      { id: 'b_24_dup', x: 2, y: 0 + 30 + 40, w: 2, h: 1, hidden: false },
      { id: 'c_24_dup', x: 1, y: 0 + 30 + 40, w: 2, h: 1, hidden: true },
      { id: 'd_24_dup', x: 3, y: 0 + 30 + 40, w: 2, h: 1, hidden: true },
      // 25 (max h: 2, acc: 32)
      { id: 'a_25_dup', x: 0, y: 0 + 32 + 40, w: 2, h: 2, hidden: false },
      { id: 'b_25_dup', x: 2, y: 0 + 32 + 40, w: 1, h: 1, hidden: true },
      { id: 'c_25_dup', x: 1, y: 1 + 32 + 40, w: 3, h: 1, hidden: false },
      // 26 (max h: 2, acc: 34)
      { id: 'a_26_dup', x: 0, y: 0 + 34 + 40, w: 1, h: 1, hidden: false },
      { id: 'b_26_dup', x: 0, y: 0 + 34 + 40, w: 1, h: 2, hidden: true },
      { id: 'c_26_dup', x: 0, y: 1 + 34 + 40, w: 1, h: 1, hidden: false },
      // 27 (max h: 3, acc: 37)
      { id: 'a_27_dup', x: 0, y: 0 + 37 + 40, w: 3, h: 3, hidden: false },
      { id: 'b_27_dup', x: 3, y: 1 + 37 + 40, w: 2, h: 3, hidden: false },
      { id: 'c_27_dup', x: 1, y: 3 + 37 + 40, w: 3, h: 1, hidden: true },
    ];

    const dynamic: DynamicData[] = [
      // 1 (max h: 1)
      { id: 'a_1', height: 1, hidden: false },
      // 2 (max h: 3)
      { id: 'a_2', height: 3, hidden: false },
      // 3 (max h: 2)
      { id: 'a_3', height: 1, hidden: false },
      // 4 (max h: 2)
      { id: 'a_4', height: 2, hidden: false },
      { id: 'b_4', height: 1, hidden: false },
      { id: 'c_4', height: 1, hidden: false },
      // 5 (max h: 2)
      { id: 'a_5', height: 2, hidden: false },
      { id: 'b_5', height: 1, hidden: false },
      // 6 (max h: 2)
      { id: 'a_6', height: 1, hidden: false },
      { id: 'b_6', height: 2, hidden: false },
      { id: 'c_6', height: 1, hidden: false },
      // 7 (max h: 3)
      { id: 'a_7', height: 2, hidden: false },
      { id: 'b_7', height: 3, hidden: false },
      { id: 'c_7', height: 2, hidden: false },
      // 8 (max h: 2)
      { id: 'a_8', height: 2, hidden: false },
      { id: 'b_8', height: 2, hidden: false },
      { id: 'c_8', height: 1, hidden: false },
      // 9 (max h: 5)
      { id: 'a_9', height: 5, hidden: false },
      { id: 'b_9', height: 1, hidden: false },
      { id: 'c_9', height: 1, hidden: false },
      // 10 (max h: 3)
      { id: 'a_10', height: 1, hidden: false },
      { id: 'b_10', height: 3, hidden: false },
      { id: 'c_10', height: 1, hidden: false },
      { id: 'd_10', height: 1, hidden: false },
      // 11 (max h: 1)
      { id: 'a_11', height: 1, hidden: false },
      { id: 'b_11', height: 1, hidden: false },
      // 12 (max h: 2)
      { id: 'a_12', height: 2, hidden: false },
      { id: 'b_12', height: 1, hidden: false },
      // 13 (max h: 2)
      { id: 'a_13', height: 2, hidden: false },
      { id: 'b_13', height: 1, hidden: false },
      { id: 'c_13', height: 1, hidden: false },
      // 14 (max h: 1)
      { id: 'a_14', height: 1, hidden: true },
      { id: 'b_14', height: 1, hidden: false },
      // 15 (max h: 1)
      { id: 'a_15', height: 1, hidden: true },
      // 16 (max h: 1)
      { id: 'a_16', height: 1, hidden: false },
      // 17 (max h: 1)
      { id: 'a_17', height: 1, hidden: true },
      { id: 'b_17', height: 1, hidden: true },
      // 18 (max h: 1)
      { id: 'a_18', height: 1, hidden: true },
      { id: 'b_18', height: 1, hidden: false },
      // 19 (max h: 1)
      { id: 'a_19', height: 1, hidden: false },
      { id: 'b_19', height: 1, hidden: false },
      // 20 (max h: 1)
      { id: 'a_20', height: 1, hidden: true },
      { id: 'b_20', height: 1, hidden: false },
      // 21 (max h: 1)
      { id: 'a_21', height: 1, hidden: true },
      { id: 'b_21', height: 1, hidden: false },
      { id: 'c_21', height: 1, hidden: false },
      { id: 'd_21', height: 1, hidden: false },
      // 22 (max h: 1)
      { id: 'a_22', height: 1, hidden: false },
      { id: 'b_22', height: 1, hidden: false },
      // 23 (max h: 1)
      { id: 'a_23', height: 1, hidden: false },
      { id: 'b_23', height: 1, hidden: false },
      // 24 (max h: 1)
      { id: 'a_24', height: 1, hidden: false },
      { id: 'b_24', height: 1, hidden: false },
      { id: 'c_24', height: 1, hidden: false },
      { id: 'd_24', height: 1, hidden: false },
      // 25 (max h: 3)
      { id: 'a_25', height: 2, hidden: false },
      { id: 'b_25', height: 3, hidden: false },
      { id: 'c_25', height: 1, hidden: false },
      // 26 (max h: 2)
      { id: 'a_26', height: 1, hidden: true },
      { id: 'b_26', height: 2, hidden: false },
      { id: 'c_26', height: 1, hidden: false },
      // 27 (max h: 3)
      { id: 'a_27', height: 3, hidden: false },
      { id: 'b_27', height: 3, hidden: false },
      { id: 'c_27', height: 1, hidden: false },

      // duplicate to increase data size

      // 1 (max h: 1)
      { id: 'a_1_dup', height: 1, hidden: false },
      // 2 (max h: 3)
      { id: 'a_2_dup', height: 3, hidden: false },
      // 3 (max h: 2)
      { id: 'a_3_dup', height: 1, hidden: false },
      // 4 (max h: 2)
      { id: 'a_4_dup', height: 2, hidden: false },
      { id: 'b_4_dup', height: 1, hidden: false },
      { id: 'c_4_dup', height: 1, hidden: false },
      // 5 (max h: 2)
      { id: 'a_5_dup', height: 2, hidden: false },
      { id: 'b_5_dup', height: 1, hidden: false },
      // 6 (max h: 2)
      { id: 'a_6_dup', height: 1, hidden: false },
      { id: 'b_6_dup', height: 2, hidden: false },
      { id: 'c_6_dup', height: 1, hidden: false },
      // 7 (max h: 3)
      { id: 'a_7_dup', height: 2, hidden: false },
      { id: 'b_7_dup', height: 3, hidden: false },
      { id: 'c_7_dup', height: 2, hidden: false },
      // 8 (max h: 2)
      { id: 'a_8_dup', height: 2, hidden: false },
      { id: 'b_8_dup', height: 2, hidden: false },
      { id: 'c_8_dup', height: 1, hidden: false },
      // 9 (max h: 5)
      { id: 'a_9_dup', height: 5, hidden: false },
      { id: 'b_9_dup', height: 1, hidden: false },
      { id: 'c_9_dup', height: 1, hidden: false },
      // 10 (max h: 3)
      { id: 'a_10_dup', height: 1, hidden: false },
      { id: 'b_10_dup', height: 3, hidden: false },
      { id: 'c_10_dup', height: 1, hidden: false },
      { id: 'd_10_dup', height: 1, hidden: false },
      // 11 (max h: 1)
      { id: 'a_11_dup', height: 1, hidden: false },
      { id: 'b_11_dup', height: 1, hidden: false },
      // 12 (max h: 2)
      { id: 'a_12_dup', height: 2, hidden: false },
      { id: 'b_12_dup', height: 1, hidden: false },
      // 13 (max h: 2)
      { id: 'a_13_dup', height: 2, hidden: false },
      { id: 'b_13_dup', height: 1, hidden: false },
      { id: 'c_13_dup', height: 1, hidden: false },
      // 14 (max h: 1)
      { id: 'a_14_dup', height: 1, hidden: true },
      { id: 'b_14_dup', height: 1, hidden: false },
      // 15 (max h: 1)
      { id: 'a_15_dup', height: 1, hidden: true },
      // 16 (max h: 1)
      { id: 'a_16_dup', height: 1, hidden: false },
      // 17 (max h: 1)
      { id: 'a_17_dup', height: 1, hidden: true },
      { id: 'b_17_dup', height: 1, hidden: true },
      // 18 (max h: 1)
      { id: 'a_18_dup', height: 1, hidden: true },
      { id: 'b_18_dup', height: 1, hidden: false },
      // 19 (max h: 1)
      { id: 'a_19_dup', height: 1, hidden: false },
      { id: 'b_19_dup', height: 1, hidden: false },
      // 20 (max h: 1)
      { id: 'a_20_dup', height: 1, hidden: true },
      { id: 'b_20_dup', height: 1, hidden: false },
      // 21 (max h: 1)
      { id: 'a_21_dup', height: 1, hidden: true },
      { id: 'b_21_dup', height: 1, hidden: false },
      { id: 'c_21_dup', height: 1, hidden: false },
      { id: 'd_21_dup', height: 1, hidden: false },
      // 22 (max h: 1)
      { id: 'a_22_dup', height: 1, hidden: false },
      { id: 'b_22_dup', height: 1, hidden: false },
      // 23 (max h: 1)
      { id: 'a_23_dup', height: 1, hidden: false },
      { id: 'b_23_dup', height: 1, hidden: false },
      // 24 (max h: 1)
      { id: 'a_24_dup', height: 1, hidden: false },
      { id: 'b_24_dup', height: 1, hidden: false },
      { id: 'c_24_dup', height: 1, hidden: false },
      { id: 'd_24_dup', height: 1, hidden: false },
      // 25 (max h: 3)
      { id: 'a_25_dup', height: 2, hidden: false },
      { id: 'b_25_dup', height: 3, hidden: false },
      { id: 'c_25_dup', height: 1, hidden: false },
      // 26 (max h: 2)
      { id: 'a_26_dup', height: 1, hidden: true },
      { id: 'b_26_dup', height: 2, hidden: false },
      { id: 'c_26_dup', height: 1, hidden: false },
      // 27 (max h: 3)
      { id: 'a_27_dup', height: 3, hidden: false },
      { id: 'b_27_dup', height: 3, hidden: false },
      { id: 'c_27_dup', height: 1, hidden: false },
    ];

    // const startTime = performance.now();
    const result = compact(base, dynamic);
    // const endTime = performance.now();

    // const executionTime = endTime - startTime;
    // console.log(`Performance test results:`);
    // console.log(`- Total base items: ${base.length}`);
    // console.log(`- Total dynamic items: ${dynamic.length}`);
    // console.log(`- Result items: ${result.length}`);
    // console.log(`- Execution time: ${executionTime.toFixed(3)}ms`);

    // Assert that it completed successfully
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });
});
