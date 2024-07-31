export const is_ban_patten = (ltt_num: number[], ban_type: boolean[] = [true, true, true, true, true, true, true]) => {
    let ban_patten: number[] = new Array(7).fill(0);

    // 1: 홀짝 밴
    if (ban_type[0]) {
        let oddCount = ltt_num.filter((num) => num % 2 === 1).length;
        if (oddCount === 0 || oddCount === 6) {
            ban_patten[0] = 1;
        }
    }

    // 2: 고저 밴
    if (ban_type[1]) {
        let lowCount = ltt_num.filter((num) => num < 23).length;
        if (lowCount === 0 || lowCount === 6) {
            ban_patten[1] = 1;
        }
    }

    // 3: 1의 자리 밴
    if (ban_type[2]) {
        let cntUnits = new Array(10).fill(0);
        ltt_num.forEach((num) => {
            cntUnits[num % 10]++;
        });
        let maxUnits = Math.max(...cntUnits);
        if (![1, 2].includes(maxUnits)) {
            ban_patten[2] = 1;
        }
    }
    // 4: 10의 자리 밴
    if (ban_type[3]) {
        let cntTens = new Array(10).fill(0);
        ltt_num.forEach((num) => {
            cntTens[Math.floor(num / 10)]++;
        });
        let maxTens = Math.max(...cntTens);
        if (![2, 3].includes(maxTens)) {
            ban_patten[3] = 1;
        }
    }

    // 5: 연속번호 밴
    if (ban_type[4]) {
        let cntConsecutive = 0;
        for (let idx = 0; idx < ltt_num.length - 1; idx++) {
            if (ltt_num[idx + 1] - ltt_num[idx] === 1) {
                cntConsecutive++;
            }
        }
        if (![0, 1, 2].includes(cntConsecutive)) {
            ban_patten[4] = 1;
        }
    }

    // 6: 시작 번호 밴
    if (ban_type[5]) {
        if (ltt_num[0] > 14) {
            ban_patten[5] = 1;
        }
    }

    // 7: 끝 번호 밴
    if (ban_type[6]) {
        if (ltt_num[ltt_num.length - 1] < 32) {
            ban_patten[6] = 1;
        }
    }

    if (ban_patten.reduce((a, b) => a + b, 0) > 0) {
        return true;
    }
    return false;
};
