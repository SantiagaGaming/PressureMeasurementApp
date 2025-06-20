import Image from '@/components/ui/image/Image';
import styles from './ChoiseModal.module.css';
import { close } from '@/utils/constants';
import TextButton from '@/components/ui/buttons/textButton/TextButton';
interface ChoiseModalProps {
    titleText: string;
    text: string;
    onClose: () => void;
    onSubmit: () => void;
}
const ChoiseModal = ({
    titleText,
    text,
    onClose,
    onSubmit,
}: ChoiseModalProps) => {
    return (
        <div className={styles.modal}>
            <div className={styles.header}>
                <div className={styles.headerText}>{titleText}</div>
                <div className={styles.close}>
                    <Image
                        name={close}
                        onClick={onClose}
                        width={24}
                        height={24}
                    />
                </div>
            </div>

            <div>{text}</div>

            <div className={styles.buttons}>
                <div className={styles.button}>
                    <TextButton
                        text="Отменить"
                        variant="light"
                        onClick={onClose}
                    />
                </div>
                <div className={styles.button}>
                    <TextButton text="Подтвердить" onClick={onSubmit} />
                </div>
            </div>
        </div>
    );
};
export default ChoiseModal;
