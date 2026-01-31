/**
 * ReviewerPage
 *
 * Question review workflow for reviewers.
 */

import { useNavigate } from 'react-router-dom';
import ReviewerPanel from '../../components/admin/ReviewerPanel';
import { ROUTES } from '../../router/routes';

export default function ReviewerPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(ROUTES.HOME);
  };

  return (
    <ReviewerPanel
      onBack={handleBack}
    />
  );
}
