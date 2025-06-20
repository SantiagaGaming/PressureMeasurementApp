import styles from './PageHeader.module.css';
import Image from '../ui/image/Image';
import { bell, smallLogo } from '@/utils/constants';
import IconButton from '../ui/buttons/iconButton/IconButton';

const Header = () => {
    return (
        <div className={styles.header}>
            <Image name={smallLogo} width={38} height={32} />
            <div className={styles.rightPanel}>
                <IconButton icon={bell} number={5} width={38} height={32} />
            </div>
        </div>
    );
};
export default Header;
