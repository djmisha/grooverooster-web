import Image from "next/image";

interface SpinnerProps {
  isLoading: boolean;
  text?: string;
}

/**
 * Spinner component displays a loading indicator with optional text
 * @param props - Component props
 * @param props.isLoading - Whether to show the loading spinner
 * @param props.text - Loading text to display
 * @returns Loading spinner with text
 */
const Spinner = ({ isLoading, text = "loading" }: SpinnerProps) => (
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
