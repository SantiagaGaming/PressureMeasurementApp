import styles from './ColoredText.module.css';

type TextColor = keyof typeof TEXT_COLOR_MAP;
type BackgroundColor = keyof typeof BACKGROUND_COLOR_MAP;
type BorderType = 'square' | 'circle' | undefined;

const TEXT_COLOR_MAP = {
    black: '#000000',
    red: '#FF4040',
    blue: '#4091FD',
    indigo: '#696CFF',
    gray: '#5D5E6F',
} as const;

const BACKGROUND_COLOR_MAP = {
    none: 'transparent',
    lightBlue: '#EEF',
    lightRed: '#FFDDE2',
    gray: '#F1F1F3',
} as const;

interface ColoredTextProps {
    text: string;
    borderColor?: BackgroundColor;
    borderType?: BorderType;
    textColor?: TextColor;
}

const ColoredText = ({
    text,
    borderColor = 'none',
    borderType,
    textColor = 'black',
}: ColoredTextProps) => {
    const borderClass =
        borderColor === 'none'
            ? ''
            : borderType === 'square'
              ? styles.borderSquare
              : styles.borderCircle;

    const backgroundStyle = {
        backgroundColor: BACKGROUND_COLOR_MAP[borderColor] || 'transparent',
    };
    
    const colorStyle = { 
        color: TEXT_COLOR_MAP[textColor] || '#000000' 
    };

    return (
        <div className={borderClass} style={backgroundStyle}>
            <span className={styles.text} style={colorStyle}>
                {text}
            </span>
        </div>
    );
};

export default ColoredText;