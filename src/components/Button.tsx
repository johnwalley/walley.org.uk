import Link from 'next/link'
import clsx from 'clsx'

const variantStyles = {
  primary:
    'bg-teal-500 font-semibold text-white hover:bg-teal-600 active:bg-teal-700 active:text-white/80 dark:bg-teal-500 dark:hover:bg-teal-400 dark:active:bg-teal-500 dark:active:text-white/80',
  secondary:
    'bg-zinc-100 font-medium text-zinc-900 ring-1 ring-zinc-900/10 hover:bg-zinc-200 active:bg-zinc-200 active:text-zinc-900/70 dark:bg-zinc-700 dark:text-zinc-100 dark:ring-white/10 dark:hover:bg-zinc-600 dark:hover:text-white dark:active:bg-zinc-700 dark:active:text-zinc-100/70',
}

type ButtonProps = {
  variant?: keyof typeof variantStyles
} & (
  | (React.ComponentPropsWithoutRef<'button'> & { href?: undefined })
  | React.ComponentPropsWithoutRef<typeof Link>
)

export function Button({
  variant = 'primary',
  className,
  ...props
}: ButtonProps) {
  className = clsx(
    'inline-flex items-center gap-2 justify-center rounded-md py-2 px-3 text-sm outline-offset-2 transition active:transition-none',
    variantStyles[variant],
    className,
  )

  return typeof props.href === 'undefined' ? (
    <button className={className} {...props} />
  ) : (
    <Link className={className} {...props} />
  )
}
