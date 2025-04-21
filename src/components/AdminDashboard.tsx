import React, { useState } from 'react';

// Define prop types for SVG icons
interface NavIconProps extends React.SVGProps<SVGSVGElement> {
    children?: React.ReactNode;
}

// Mock icons using SVG elements
const NavIcon = ({ children, ...props }: NavIconProps) => {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            {children}
        </svg>
    );
};

const NewsIcon = (props: NavIconProps) => (
    <NavIcon {...props}>
        <rect x="4" y="5" width="16" height="16" rx="2" />
        <line x1="4" y1="9" x2="20" y2="9" />
        <line x1="8" y1="13" x2="16" y2="13" />
        <line x1="8" y1="17" x2="12" y2="17" />
    </NavIcon>
);

const BookIcon = (props: NavIconProps) => (
    <NavIcon {...props}>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </NavIcon>
);

const MapIcon = (props: NavIconProps) => (
    <NavIcon {...props}>
        <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
        <line x1="8" y1="2" x2="8" y2="18" />
        <line x1="16" y1="6" x2="16" y2="22" />
    </NavIcon>
);

const VideoIcon = (props: NavIconProps) => (
    <NavIcon {...props}>
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </NavIcon>
);

const HomeIcon = (props: NavIconProps) => (
    <NavIcon {...props}>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
    </NavIcon>
);

const MenuIcon = (props: NavIconProps) => (
    <NavIcon {...props}>
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="18" x2="21" y2="18" />
    </NavIcon>
);

// NavItem component props
interface NavItemProps {
    icon: React.ComponentType<NavIconProps>;
    children: React.ReactNode;
    active: boolean;
    onClick: () => void;
}

// NavItem component
const NavItem: React.FC<NavItemProps> = ({ icon: Icon, children, active, onClick }) => {
    return (
        <div
            className={`flex items-center px-4 py-3 cursor-pointer transition-all duration-150 rounded-md ${active ? "bg-teal-800 text-white font-semibold" : "text-gray-300 hover:bg-teal-700 hover:text-white"}`}
            onClick={onClick}
        >
            {Icon && (
                <span className={`mr-4 ${active ? "text-white" : "text-gray-400"}`}>
                    <Icon />
                </span>
            )}
            {children}
        </div>
    );
};

// Activity item interface
interface ActivityItem {
    action: string;
    user: string;
    time: string;
}

// Dashboard stats item interface
interface DashboardStatItem {
    name: string;
    count: number;
    icon: React.ComponentType<NavIconProps>;
}

// Dashboard Component
const Dashboard: React.FC = () => {
    // Dashboard stats
    const dashboardStats: DashboardStatItem[] = [
        { name: "News", count: 12, icon: NewsIcon },
        { name: "Books", count: 8, icon: BookIcon },
        { name: "Maps", count: 5, icon: MapIcon },
        { name: "Videos", count: 7, icon: VideoIcon }
    ];

    const recentActivities: ActivityItem[] = [
        { action: "Added new book", user: "Admin", time: "5 minutes ago" },
        { action: "Updated news article", user: "Editor", time: "2 hours ago" },
        { action: "Uploaded new map", user: "Admin", time: "Yesterday" },
        { action: "Added video content", user: "Content Team", time: "3 days ago" }
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-teal-900">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {dashboardStats.map((item) => (
                    <div
                        key={item.name}
                        className="p-5 shadow-md border border-gray-200 rounded-lg bg-white"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-medium text-teal-800">{item.name}</h2>
                            <span className="text-teal-600">
                                <item.icon />
                            </span>
                        </div>
                        <div className="mt-4 text-2xl font-bold">
                            {item.count} <span className="text-sm font-normal">items</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 p-5 shadow-md border border-gray-200 rounded-lg bg-white">
                <h2 className="text-lg font-medium mb-4 text-teal-800">Recent Activity</h2>
                <div className="space-y-3">
                    {recentActivities.map((activity, idx) => (
                        <div
                            key={idx}
                            className="flex justify-between p-3 rounded-md border border-gray-200"
                        >
                            <div>
                                <div className="font-medium">{activity.action}</div>
                                <div className="text-sm text-gray-500">by {activity.user}</div>
                            </div>
                            <div className="text-sm text-gray-500 self-center">{activity.time}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// News item interface
interface NewsItem {
    _id: string;
    title: string;
    body: string;
    imageUrl: string;
}

// News Component
const NewsManager: React.FC = () => {
    const [newsList, setNewsList] = useState<NewsItem[]>([
        {
            _id: "1",
            title: "New Technology Breakthrough",
            body: "Scientists have discovered a revolutionary new approach to renewable energy that could transform how we power our homes and businesses...",
            imageUrl: "/api/placeholder/800/400"
        },
        {
            _id: "2",
            title: "Global Economic Summit",
            body: "World leaders gather to discuss economic policies and sustainable development strategies for the post-pandemic era...",
            imageUrl: "/api/placeholder/800/400"
        }
    ]);
    const [title, setTitle] = useState<string>("");
    const [body, setBody] = useState<string>("");
    const [image, setImage] = useState<File | null>(null);
    const [uploading, setUploading] = useState<boolean>(false);

    const handleCreateNews = () => {
        if (!title.trim() || !body.trim()) {
            return; // Prevent empty submissions
        }

        setUploading(true);
        setTimeout(() => {
            const newNewsItem: NewsItem = {
                _id: Date.now().toString(),
                title,
                body,
                imageUrl: "/api/placeholder/800/400"
            };
            setNewsList([newNewsItem, ...newsList]);
            setTitle("");
            setBody("");
            setImage(null);
            setUploading(false);
        }, 1000);
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-teal-900">Manage News</h1>

            {/* Create News Form */}
            <div className="p-6 shadow-md border border-gray-200 rounded-lg bg-white mb-6">
                <h2 className="text-lg font-medium mb-4 text-teal-800">Create News Article</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="News Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                        <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="News Body"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            rows={5}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
                        <input
                            type="file"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            accept="image/*"
                            onChange={(e) => {
                                const files = e.target.files;
                                if (files && files.length > 0) {
                                    setImage(files[0]);
                                }
                            }}
                        />
                    </div>

                    <button
                        className={`px-4 py-2 rounded-md text-white ${uploading ? 'bg-teal-400' : 'bg-teal-600 hover:bg-teal-700'}`}
                        onClick={handleCreateNews}
                        disabled={uploading}
                    >
                        {uploading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                </svg>
                                Uploading...
                            </span>
                        ) : "Create News"}
                    </button>
                </div>
            </div>

            {/* News List */}
            <div className="p-6 shadow-md border border-gray-200 rounded-lg bg-white">
                <h2 className="text-lg font-medium mb-4 text-teal-800">Published News</h2>

                <div className="space-y-6">
                    {newsList.map((news) => (
                        <div key={news._id} className="border-b border-gray-200 pb-6 last:border-0">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="md:w-1/3">
                                    <img
                                        src={news.imageUrl}
                                        alt={news.title}
                                        className="w-full h-48 object-cover rounded-md"
                                    />
                                </div>
                                <div className="md:w-2/3">
                                    <h3 className="text-xl font-medium text-teal-800">{news.title}</h3>
                                    <p className="mt-2 text-gray-600">{news.body}</p>

                                    <div className="mt-4 flex gap-2">
                                        <button className="px-3 py-1 bg-teal-50 text-teal-700 rounded-md hover:bg-teal-100">Edit</button>
                                        <button className="px-3 py-1 bg-red-50 text-red-700 rounded-md hover:bg-red-100">Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Books Component
const BooksManager: React.FC = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-teal-900">Manage Books</h1>
            <div className="p-6 shadow-md border border-gray-200 rounded-lg bg-white">
                <p className="text-gray-600">Book management functionality will be implemented here.</p>
            </div>
        </div>
    );
};

// Maps Component
const MapsManager: React.FC = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-teal-900">Manage Maps</h1>
            <div className="p-6 shadow-md border border-gray-200 rounded-lg bg-white">
                <p className="text-gray-600">Maps management functionality will be implemented here.</p>
            </div>
        </div>
    );
};

// Videos Component
const VideosManager: React.FC = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-teal-900">Manage Videos</h1>
            <div className="p-6 shadow-md border border-gray-200 rounded-lg bg-white">
                <p className="text-gray-600">Video management functionality will be implemented here.</p>
            </div>
        </div>
    );
};

// NavItem interface for the main app
interface NavItemType {
    id: string;
    name: string;
    icon: React.ComponentType<NavIconProps>;
}

// Main App
const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>("dashboard");
    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

    const navItems: NavItemType[] = [
        { id: "dashboard", name: "Dashboard", icon: HomeIcon },
        { id: "news", name: "News", icon: NewsIcon },
        { id: "books", name: "Books", icon: BookIcon },
        { id: "maps", name: "Maps", icon: MapIcon },
        { id: "videos", name: "Videos", icon: VideoIcon }
    ];

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar - Desktop */}
            <div className="hidden md:flex md:w-64 flex-shrink-0">
                <div className="flex flex-col w-full bg-teal-900 py-4">
                    <div className="px-4 pb-6 flex items-center border-b border-teal-800">
                        <h1 className="text-xl font-bold text-white">Content Admin</h1>
                    </div>

                    <div className="mt-8 flex flex-col px-2 space-y-1">
                        {navItems.map((item) => (
                            <NavItem
                                key={item.id}
                                icon={item.icon}
                                active={activeTab === item.id}
                                onClick={() => setActiveTab(item.id)}
                            >
                                {item.name}
                            </NavItem>
                        ))}
                    </div>

                    <div className="mt-auto px-4 py-6">
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white font-semibold">
                                A
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-white">Admin User</p>
                                <p className="text-xs text-teal-300">admin@example.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Header */}
            <div className="md:hidden bg-teal-900 text-white w-full fixed top-0 z-10">
                <div className="flex items-center justify-between px-4 py-3">
                    <h1 className="text-lg font-bold">Content Admin</h1>
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="text-white focus:outline-none"
                    >
                        <MenuIcon />
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        {navItems.map((item) => (
                            <NavItem
                                key={item.id}
                                icon={item.icon}
                                active={activeTab === item.id}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    setMobileMenuOpen(false);
                                }}
                            >
                                {item.name}
                            </NavItem>
                        ))}
                    </div>
                )}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                <main className="flex-1 overflow-y-auto bg-gray-100 p-4 md:p-6 md:mt-0 mt-16">
                    {activeTab === "dashboard" && <Dashboard />}
                    {activeTab === "news" && <NewsManager />}
                    {activeTab === "books" && <BooksManager />}
                    {activeTab === "maps" && <MapsManager />}
                    {activeTab === "videos" && <VideosManager />}
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;