const EmptyState = ({ icon: Icon, title, description, actionButton }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-12">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <Icon className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-center mb-6 max-w-sm">{description}</p>
      {actionButton && actionButton}
    </div>
  )
}

export default EmptyState