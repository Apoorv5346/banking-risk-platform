function Sidebar() {
    return (
        <aside className="sidebar">
            <div className="brand">
                Banking Risk
                <span>Platform</span>
            </div>

            <nav>
                <a className="active">Dashboard</a>
                <a>Transactions</a>
                <a>Customers</a>
                <a>Risk Analysis</a>
                <a>Analytics</a>
                <a>Reports</a>
                <a>Settings</a>
            </nav>
        </aside>
    )
}

export default Sidebar