"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Modal from "../Modal/VerifyModal";
import Button from "../Button/Button";

/**
 * Verify component displays email verification success modal when user confirms email
 * @returns {JSX.Element|null} Verification modal or null
 */
const Verify = () => {
  const [showModal, setShowModal] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("code")) {
      setShowModal(true);
    }
  }, [searchParams]);

  /**
   * Closes the verification modal and cleans up URL
   */
  const closeModal = () => {
    setShowModal(false);
    const newUrl = window.location.pathname;
    window.history.replaceState({}, document.title, newUrl);
  };

  return (
    showModal && (
      <Modal onClose={closeModal}>
        <div className="verification-success">
          <h2>Email Verified</h2>
          <p>
            Thank you for confirming your email. You may now login to our
            site.{" "}
          </p>
          <div className="verification-actions">
            <Link href="/login">
              <Button variant="primary">Go to Login</Button>
            </Link>
          </div>
        </div>
      </Modal>
    )
  );
};

export default Verify;
