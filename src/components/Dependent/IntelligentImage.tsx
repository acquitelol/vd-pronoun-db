import { React } from "@vendetta/metro/common"
import { General } from '@vendetta/ui/components';
import { ReactNative } from "@vendetta/metro/common"
import { manifest } from "@vendetta/plugin"

const { Image } = General;
interface IntelligentImageProps {
    style: { 
        width: string | number, 
        maxWidth?: string | number,
    }, 
    source: string 
}


const windowWidth = ReactNative.Dimensions?.get("window").width

/**
 * Main @IntelligentImage implementation. Allows to render an image without setting a @fixed height.
 * The @height is calculated by taking into account the image's @aspectRatio and the @width provided
 * @param props: This contains the style of the image and the source (image that should be rendered)
        * @param style.width: This is a required property for the image to work.
        * @param style.maxWidth?: This is an optional property which is taken into account and is defined as a property which may or may not exist  
 * @returns TSX Component
 */
export default ({ style, source }: IntelligentImageProps) => {
    const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 })
    const [normalizedWidth, setNormalizedWidth] = React.useState(0)
    
    const calculateNormalizedWidth = (): number => {
        const getParsedWidth = (width: string | number): number => typeof width == "string"
            ? (parseInt(width.replace("%", "")) * windowWidth) / 100
            : width

        const normalizedWidth = getParsedWidth(style.width)

        if (!style.maxWidth) return normalizedWidth;

        const normalizedMaxWidth = getParsedWidth(style.maxWidth)

        return normalizedWidth > normalizedMaxWidth
            ? normalizedMaxWidth
            : normalizedWidth
    }

    React.useEffect(() => {
        Image.getSize(
            source, 
            (width, height) => {
                setDimensions({ width, height })
            },
            (error) => {
                console.error(`[${manifest.name}] ${error} when fetching ${source}`)
            }
        )

        setNormalizedWidth(calculateNormalizedWidth())
    }, []);

    return <Image
        style={[
            ...Array.isArray(style) ? style : [style], 
            { 
                height: normalizedWidth * (dimensions.height / dimensions.width) 
            }
        ]}
        source={{
            uri: source
        }}
        resizeMode={"stretch"}
    />
}