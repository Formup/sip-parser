export function splitIfNotBetween(str: string, splitter: string, surrounder: string) {
    const splitIndices: number[] = [];
    let pendingSplitIndices: number[] = [];
    let surrounded = false;
    for (let i = 0; i < str.length; i++) {
        const char_i = str[i];
        if (char_i === splitter) {
            if (surrounded) {
                pendingSplitIndices.push(i);
            } else {
                splitIndices.push(i);
            }
        } else if (char_i === surrounder) {
            if (surrounded) {
                pendingSplitIndices = [];
            }
            surrounded = !surrounded;
        }
    }
    splitIndices.push(...pendingSplitIndices);
    const splittedString: string[] = [];
    let splitStartPos = 0;
    for (const splitPos of splitIndices) {
        splittedString.push(str.slice(splitStartPos, splitPos));
        splitStartPos = splitPos + 1;
    }
    splittedString.push(str.slice(splitStartPos));
    return splittedString.filter(s => s.length > 0);
}
