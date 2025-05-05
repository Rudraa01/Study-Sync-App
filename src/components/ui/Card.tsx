import { forwardRef } from 'react';
import clsx from 'clsx';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: keyof JSX.IntrinsicElements;
  padded?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ as: Component = 'div', className, padded = true, children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={clsx(
          'bg-white rounded-lg shadow-sm ring-1 ring-gray-900/5',
          padded && 'p-6',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Card.displayName = 'Card';

export default Card;
