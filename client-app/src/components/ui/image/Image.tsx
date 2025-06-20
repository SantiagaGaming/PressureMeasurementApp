interface ImageProps {
    name: string;
    width: number;
    height: number;
    onClick?: () => void;
}

const Image = ({ name, width, height, onClick }: ImageProps) => {
    return (
        <img
            src={`/public/${name}`}
            width={width}
            height={height}
            onClick={onClick}
        />
    );
};
export default Image;
