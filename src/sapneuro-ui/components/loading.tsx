import { Spinner } from './spinner'

export function Loading() {
  return (
    <div className="relative h-full w-full flex items-center justify-center min-h-32">
      <div className="text-sapienza-red">
        <Spinner size={48} />
      </div>
    </div>
  )
}
