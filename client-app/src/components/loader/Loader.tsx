import { Spinner } from 'react-bootstrap';
import styles from './Loader.module.css';

 const Loader = () => {
    return (
        <div className={styles.spinnerContainer}>
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    );
};
export default Loader;