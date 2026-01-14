/**
 * Converts a number to Traditional Chinese financial characters (大寫數字).
 * Example: 1234 -> 壹仟貳佰參拾肆
 */
export const numberToChinese = (n: number): string => {
  if (!Number.isFinite(n) || n < 0) return "零";
  if (n === 0) return "零";

  const fraction = ['角', '分'];
  const digit = ['零', '壹', '貳', '參', '肆', '伍', '陸', '柒', '捌', '玖'];
  const unit = [
    ['元', '萬', '億'],
    ['', '拾', '佰', '仟'],
  ];

  let head = n < 0 ? '負' : '';
  n = Math.abs(n);

  let s = '';
  
  // Handle integers
  for (let i = 0; i < unit[0].length && n > 0; i++) {
    let p = '';
    for (let j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p;
      n = Math.floor(n / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }
  
  return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
};

export interface ChineseAmountPart {
    digit: string;
    unit: string;
}

/**
 * Returns an array of digit/unit pairs for custom rendering.
 * Forces display of unit even for zero digits (e.g., 100 -> 壹佰 零拾 零元).
 */
export const getChineseAmountParts = (n: number): ChineseAmountPart[] => {
    if (!Number.isFinite(n)) n = 0;
    n = Math.max(0, Math.floor(n)); // Ensure positive integer
    
    const str = n.toString();
    const len = str.length;
    const digitMap = ['零', '壹', '貳', '參', '肆', '伍', '陸', '柒', '捌', '玖'];
    
    // Position 0 is 元, 1 is 拾, etc.
    // Repeating pattern: 元, 拾, 佰, 仟, 萬, 拾, 佰, 仟, 億, 拾, 佰, 仟, 兆...
    const units = ['元', '拾', '佰', '仟', '萬', '拾', '佰', '仟', '億', '拾', '佰', '仟', '兆'];
    
    const parts: ChineseAmountPart[] = [];
    
    for (let i = 0; i < len; i++) {
        const digit = parseInt(str[i]);
        // Calculate position from right (0-based)
        const pos = len - 1 - i;
        
        parts.push({
            digit: digitMap[digit],
            unit: units[pos] || ''
        });
    }
    
    return parts;
};