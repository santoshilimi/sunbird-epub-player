import {chain, Rule} from '@angular-devkit/schematics';
import {Schema} from './schema';
import {addPlayerModuleToAppModule} from './steps/add-player-module';
import { addPlayerStyles } from './steps/add-player-style';
/**
 * Sets up a project with all required to run sunbird pdf player.
 * This is run after 'package.json' was patched and all dependencies installed
 */
export default function ngAddSetupProject(options: Schema): Rule {
  return chain([
    addPlayerModuleToAppModule(options),
    addPlayerStyles(options),
  ]);
}
