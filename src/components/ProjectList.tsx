import React, { useState } from 'react';

interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectListProps {
  projects: Project[];
  onProjectClick: (id: string) => void;
  onProjectDelete: (id: string) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  onProjectClick,
  onProjectDelete,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = filteredProjects.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="project-list" data-testid="project-list">
      <div className="project-list-header">
        <h2>プロジェクト一覧</h2>
        <input
          type="text"
          placeholder="プロジェクトを検索..."
          value={searchTerm}
          onChange={handleSearch}
          data-testid="search-input"
        />
      </div>

      <div className="project-list-content">
        {paginatedProjects.map((project) => (
          <div
            key={project.id}
            className="project-card"
            data-testid={`project-card-${project.id}`}
          >
            <div
              className="project-card-content"
              onClick={() => onProjectClick(project.id)}
            >
              <h3 data-testid={`project-name-${project.id}`}>{project.name}</h3>
              <p data-testid={`project-description-${project.id}`}>
                {project.description}
              </p>
              <div className="project-meta">
                <span data-testid={`project-created-${project.id}`}>
                  作成日: {new Date(project.createdAt).toLocaleDateString()}
                </span>
                <span data-testid={`project-updated-${project.id}`}>
                  更新日: {new Date(project.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <button
              className="delete-button"
              onClick={() => onProjectDelete(project.id)}
              data-testid={`delete-button-${project.id}`}
            >
              削除
            </button>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination" data-testid="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={currentPage === page ? 'active' : ''}
              data-testid={`page-button-${page}`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList; 