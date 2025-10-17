import Image from "next/image";

/**
 * Spinner component displays a loading indicator with optional text
 * @param {Object} props - Component props
 * @param {boolean} props.isLoading - Whether to show the loading spinner
 * @param {string} [props.text="loading"] - Loading text to display
 * @returns {JSX.Element} Loading spinner with text
 */
const Spinner = ({ isLoading, text = "loading" }) => (
  <div className="spinner">
    <div>
      {isLoading && (
        <div className="loader">
          <Image
            src="/images/loading.svg"
            alt="loading"
            width={100}
            height={75}
          />
          <span>{text}</span>
        </div>
      )}
    </div>
  </div>
);

export default Spinner;
