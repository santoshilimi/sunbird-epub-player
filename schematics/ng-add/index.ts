import {Rule, SchematicContext, SchematicsException, Tree} from '@angular-devkit/schematics';
import {
  NodePackageInstallTask,
  RunSchematicTask,
} from '@angular-devkit/schematics/tasks';

import {getWorkspace} from '@schematics/angular/utility/workspace';

import {Schema} from './schema';
import * as messages from './messages';
import {addPackageToPackageJson} from '../utils/package-config';

interface VersionOptions {
  [key: string]: string;
}

const VERSIONS: VersionOptions = {
  // automatically filled from package.json during the build
  '@project-sunbird/sb-styles': '0.0.7',
  '@project-sunbird/client-services': '^3.4.8',
   epubjs: '0.3.88',
};

/**
 * This is executed when `ng add @project-sunbird/sunbird-epub-player-v9` is run.
 * It installs all dependencies in the 'package.json' and runs 'ng-add-setup-project' schematic.
 */
export default function ngAdd(options: Schema): Rule {
  return async (tree: Tree, context: SchematicContext) => {

    // Checking that project exists
    const {project} = options;
    if (project) {
      const workspace = await getWorkspace(tree);
      const projectWorkspace = workspace.projects.get(project);

      if (!projectWorkspace) {
        throw new SchematicsException(messages.noProject(project));
      }
    }

    // Installing dependencies
    for (const key in VERSIONS) {
      if (VERSIONS.hasOwnProperty(key)) {
        addPackageToPackageJson(tree, key, VERSIONS[key]);
      }
    }

    context.addTask(new RunSchematicTask('ng-add-setup-project', options), [
      context.addTask(new NodePackageInstallTask()),
    ]);
  };
}
