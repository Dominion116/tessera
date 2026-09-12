import FloatingNav from "@/components/navigation/floating-nav";

/**
 * The application navigation below `lg`, where the sidebar shell is hidden.
 * It is a thin wrapper over the shared floating bar, which renders the same
 * ordered items as the sidebar, so desktop and mobile navigation agree.
 */
const DockNav = () => <FloatingNav />;

export default DockNav;
