// Purely decorative, fixed behind the whole app — a blueprint dot-grid,
// four slow colour blobs sampled from the section spectrum, and a grain
// layer. Doesn't participate in layout or navigation, so it's safe to sit
// at the top of the tree without touching the app's structure.
export default function BackgroundMesh() {
  return (
    <div className="bg-mesh" aria-hidden="true">
      <span className="bg-mesh__blob bg-mesh__blob--a" />
      <span className="bg-mesh__blob bg-mesh__blob--b" />
      <span className="bg-mesh__blob bg-mesh__blob--c" />
      <span className="bg-mesh__blob bg-mesh__blob--d" />
      <span className="bg-mesh__grid" />
      <span className="bg-mesh__grain" />
    </div>
  )
}
