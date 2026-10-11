import React from 'react';
import { Link } from 'react-router-dom';
import styles from './EmptyState.module.css';

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode | { label: string; href: string };
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => {
  const renderAction = () => {
    if (!action) return null;
    if (typeof action === 'object' && 'href' in (action as any)) {
      const { label, href } = action as { label: string; href: string };
      return (
        <Link to={href} className={styles.actionLink}>
          {label}
        </Link>
      );
    }
    return action as React.ReactNode;
  };

  return (
    <div className={`${styles.emptyState} ${className || ''}`} role="status">
      <div className={styles.iconWrapper} aria-hidden="true">
        {icon}
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      {action && <div className={styles.actionWrapper}>{renderAction()}</div>}
    </div>
  );
};
