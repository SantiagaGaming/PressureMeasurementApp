import styles from './ChoiseModal.module.css';
import { close } from '@/utils/constants';
import TextButton from '@/components/ui/buttons/textButton/TextButton';
import Image from 'next/image';
interface ChoiseModalProps {
    titleText: string;
    text: string;
    onClose: () => void;
    onSubmit: () => void;
    open: boolean;
}
const ChoiseModal = ({
    titleText,
    text,
    onClose,
    onSubmit,
    open,
}: ChoiseModalProps) => {
    if (!open) return null;
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <div className={styles.headerText}>{titleText}</div>
                    <div className={styles.close}>
                        <Image
                            src={close}
                            onClick={onClose}
                            width={24}
                            height={24}
                            alt="cross"
                        />
                    </div>
                </div>

                <div>{text}</div>

                <div className={styles.buttons}>
                    <div className={styles.button}>
                        <TextButton
                            text="No"
                            variant="light"
                            onClick={onClose}
                        />
                    </div>
                    <div className={styles.button}>
                        <TextButton text="Yes" onClick={onSubmit} />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ChoiseModal;
