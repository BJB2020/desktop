import * as React from 'react'
import { Repository } from '../../models/repository'
import { Octicon, iconForRepository } from '../octicons'
import { showContextualMenu, IMenuItem } from '../main-process-proxy'
import { Repositoryish } from './group-repositories'

interface IRepositoryListItemProps {
  readonly repository: Repositoryish

  /** Called when the repository should be removed. */
  readonly onRemoveRepository: (repository: Repositoryish) => void

  /** Called when the repository should be shown in Finder/Explorer. */
  readonly onShowRepository: (repository: Repositoryish) => void

  /** Called when the repository should be shown in the shell. */
  readonly onOpenInShell: (repository: Repositoryish) => void
}

/** A repository item. */
export class RepositoryListItem extends React.Component<IRepositoryListItemProps, void> {
  public render() {
    const repository = this.props.repository
    const path = repository.path
    const gitHubRepo = repository instanceof Repository ? repository.gitHubRepository : null
    const tooltip = gitHubRepo
      ? gitHubRepo.fullName + '\n' + gitHubRepo.htmlURL + '\n' + path
      : path

    return (
      <div onContextMenu={this.onContextMenu} className='repository-list-item' title={tooltip}>
        <Octicon symbol={iconForRepository(repository)} />
        <div className='name'>{repository.name}</div>
      </div>
    )
  }

  public shouldComponentUpdate(nextProps: IRepositoryListItemProps): boolean {
    if (nextProps.repository instanceof Repository && this.props.repository instanceof Repository) {
      return nextProps.repository.id !== this.props.repository.id
    } else {
      return true
    }
  }

  private onContextMenu = (event: React.MouseEvent<any>) => {
    event.preventDefault()

    const items: ReadonlyArray<IMenuItem> = [
      {
        label: __DARWIN__ ? 'Open in Terminal' : 'Open command prompt',
        action: this.openInShell,
      },
      {
        label: __DARWIN__ ? 'Show in Finder' : 'Show in Explorer',
        action: this.showRepository,
      },
      { type: 'separator' },
      {
        label: 'Remove',
        action: this.removeRepository,
      },
    ]
    showContextualMenu(items)
  }

  private removeRepository = () => {
    this.props.onRemoveRepository(this.props.repository)
  }

  private showRepository = () => {
    this.props.onShowRepository(this.props.repository)
  }

  private openInShell = () => {
    this.props.onOpenInShell(this.props.repository)
  }
}
