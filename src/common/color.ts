export const filterColor = (color: string, light: string, dark: string, boundary: number = 186): string => {
    let baseColor = color.replace("#", "")
    const parseColorAsInt = (color: string, digits: number[], base: number) => parseInt(color.substring(digits[0], digits[1]), base)
    const red = parseColorAsInt(baseColor, [0, 2], 16),
        green = parseColorAsInt(baseColor, [2, 4], 16),
        blue = parseColorAsInt(baseColor, [4, 6], 16);

    return (((red + green + blue) / (255 * 3)) > boundary)
        ?   dark 
        :   light
};