export function CategoryCardSkeleton() {
  return (
    <>
      <div className="collapse not-first:mt-4 shadow-sm bg-base-100 max-h-full pointer-events-none">
        <input type="checkbox" checked/>
        <div className="collapse-title"><div class="skeleton h-4 w-3/5"></div></div>
        <div className="collapse-content -my-2 px-2 min-w-0 min-h-0 grid text-sm overflow-y-scroll">
          <LinksSkeleton />
        </div>
      </div>
      <div className="collapse not-first:mt-4 shadow-sm bg-base-100 max-h-full pointer-events-none">
        <input type="checkbox" checked/>
        <div className="collapse-title"><div class="skeleton h-4 w-2/3"></div></div>
      </div>
      <div className="collapse not-first:mt-4 shadow-sm bg-base-100 max-h-full pointer-events-none">
        <input type="checkbox" checked/>
        <div className="collapse-title"><div class="skeleton h-4 w-4/5"></div></div>
      </div>
    </>
  )
}


export function LinksSkeleton() {
  return (
    <div class="space-y-5 mt-3 mb-2 ml-2">
      <div class="space-y-2">
        <div class="skeleton h-4 w-4/5"></div>
        <div class="skeleton h-3 w-3/5"></div>
      </div>
      <div class="space-y-2">
        <div class="skeleton h-3 w-3/5"></div>
        <div class="skeleton h-4 w-1/2"></div>
      </div>
      <div class="space-y-2">
        <div class="skeleton h-4 w-3/4"></div>
        <div class="skeleton h-3 w-2/5"></div>
      </div>
    </div>
  )
}
