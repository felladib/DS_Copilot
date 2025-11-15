import React from 'react';
import Sidebar from '../components/Sidebar';
import { useSidebar } from '../utils/SidebarContext';
import { Database, FolderArchive, Plus, Folder, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import '../Style/Dashboard.scss'; 

const Dashboard = () => {
  const { sidebarOpen } = useSidebar();

  const boxInfo = [
    {
      id: 1,
      score: 0,
      name: 'Projets',
      description: 'Active Data science projects.',
      icon: <Folder size={22} className='dashboard-box-icon' />,
    },
    {
      id: 2,
      score: 0,
      name: 'Datasets',
      description: 'Upload and manage your datasets.',
      icon: <Database size={22} className='dashboard-box-icon' />,
    },
    {
      id: 3,
      score: 0,
      name: 'Experiments',
      description: 'Model training runs.',
      icon: <Cpu size={22} className='dashboard-box-icon' />,
    },
  ];

  return (
    <div className={`dashboard-container flex`}>
      <Sidebar />
      <main
        className={`flex-1 p-8 transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-16'
        }`}
      >
        {/* Title Section */}
        <motion.div
          className='title-section'
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
          <div className="content">
            <p className="mb-4">
              Welcome to the Dashboard! Here you can find an overview of your projects and datasets.
            </p>
            <motion.button className='btn-primary' whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Plus size={22} /> New project
            </motion.button>
          </div>
        </motion.div>

        {/* Info Boxes */}
        <motion.div
          className={`dashboard-content  mt-8`}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {boxInfo.map((box) => (
            <motion.div
              key={box.id}
              className='dashboard-content-box'
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center gap-3 mb-3 justify-between">
                <h3 className="text-xl font-semibold">{box.name}</h3>
                {box.icon}
              </div>
              <p className='score'>{box.score}</p>
              <p>{box.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Projects */}
        <motion.div
          className={`recent-projects-section mt-10`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className='section-header'>
            <h2 className="text-2xl font-semibold">Recent Projects</h2>
            <span className='view-all'>View all</span>
          </div>
          <div className="content">
            <FolderArchive size={48} className='recent-projects-icon' />
            <p>No projects yet</p>
            <p>Create a new project to get started with data analysis.</p>
            <motion.button className='btn-primary' whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Plus size={22} /> New project
            </motion.button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;