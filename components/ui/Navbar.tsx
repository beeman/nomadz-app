import React from 'react'
import { Link, useLocation } from 'react-router-dom'

interface Tab {
  id: string
  label: string
}

interface NavbarProps {
  tabs: Tab[]
}

const Navbar: React.FC<NavbarProps> = ({ tabs }) => {
  const location = useLocation()
  const activeTab = location.pathname.split('/').pop()

  return (
    <>
      <nav className="px-8">
        <View className="flex space-x-8 sm:space-x-12 max-sm:justify-center max-sm:py-2">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              to={`/settings/${tab.id}`}
              className={`
                p-2 relative font-secondary text-[14px]/[20px]
                ${activeTab === tab.id ? 'text-white font-bold' : 'text-[#6B6B6B] hover:text-white/80 font-medium'}
              `}
            >
              {tab.label}
              {activeTab === tab.id && (
                <View className="absolute bottom-0 left-0 right-0 h-[1.49px] bg-white rounded-full" />
              )}
            </Link>
          ))}
        </View>
      </nav>
      <View className="h-[1.68px] bg-[#E0E4EC1a] rounded-full mt-4" />
    </>
  )
}

export default Navbar
