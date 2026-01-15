import Link from "next/link"

type InteractiveLinkProps = {
  href: string
  children?: React.ReactNode
  onClick?: () => void
  className?: string
}

const InteractiveLink = ({
  href,
  children,
  onClick,
  className = "",
  ...props
}: InteractiveLinkProps) => {
  return (
    <Link
      className={`flex gap-x-1 items-center group text-blue-600 hover:text-blue-800 ${className}`}
      href={href}
      onClick={onClick}
      {...props}
    >
      <span>{children}</span>
      <span className="group-hover:rotate-45 ease-in-out duration-150 inline-block">
        ↗
      </span>
    </Link>
  )
}

export default InteractiveLink
