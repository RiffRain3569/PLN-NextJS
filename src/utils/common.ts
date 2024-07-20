export const shuffleArray = (arr: number[]): number[] => {
    // 배열을 무작위로 섞기 위해 Fisher-Yates 알고리즘 사용
    let shuffledArray = arr.slice(); // 원본 배열을 변경하지 않기 위해 복사
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]; // 스와핑
    }
    return shuffledArray;
};
