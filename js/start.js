//
// My MetaPress Plugin

import packageJson from '../package.json'
import DoubleJumpModifier from './DoubleJumpModifier.js'
export default class DoubleJumpPlugin {

    // Plugin information
    id = packageJson.metapress?.id || packageJson.name
    name = packageJson.metapress?.name || packageJson.name
    description = packageJson.metapress?.description || packageJson.description
    version = packageJson.version
    provides = ['double-jump', 'modifier:double-jump-settings']
    requires = ['entities', 'avatar']

    avatarController = null
    playerJumped = false;
    playerDoubleJumped = false;
    amountOfDoubleJumpsTaken = 0;
    /** Called on load */
    onLoad() {

    }

    $onEntityModifierLoad() {
        this.checkAvatarModifier()
    }

    checkAvatarModifier() {
        let modifier = metapress.entities.getModifier(metapress.avatar.currentUserEntity.id, 'avatar-controller')
        if (this.avatarController == modifier) return
        this.avatarController = modifier
        if (this.avatarController.entity?.avatar_amountOfDoubleJumps)
            this.avatarController.entity.avatar_amountOfDoubleJumps = this.avatarController.entity.avatar_amountOfDoubleJumps || 1
    }

    $onRender() {
        if (this.avatarController?.isGrounded) { this.playerJumped = false; this.playerDoubleJumped = false; this.amountOfDoubleJumpsTaken = 0; }
    }

    $input_actionPressed(name) {
        if (this.playerJumped && this.playerDoubleJumped == false && name == "jump") {
            this.amountOfDoubleJumpsTaken++;
            // console.log("Double Jumped", this.avatarController?.entity?.avatar_amountOfDoubleJumps, this.amountOfDoubleJumpsTaken)
            if (this.avatarController.entity.avatar_amountOfDoubleJumps) {
                if (this.avatarController.entity.avatar_amountOfDoubleJumps > this.amountOfDoubleJumpsTaken)
                    this.playerDoubleJumped = false;
                else this.playerDoubleJumped = true;
            } else {
                this.playerDoubleJumped = true;
            }

            if (this.avatarController.yVelocity < 0)
                this.avatarController.yVelocity = this.avatarController.entity.avatar_jumpHeight || 5
            else this.avatarController.yVelocity += this.avatarController.entity.avatar_jumpHeight || 5
            this.avatarController.overrideAnimation({ animationStart: 'jump_start', animation: 'jump_loop', animationEnd: 'jump_end', interruptOnGround: true, pauseAtEnd: true })
            // console.log("Double Jumped", this.playerDoubleJumped, this.avatarController.entity.avatar_amountOfDoubleJumps, this.amountOfDoubleJumpsTaken)
        }
        if (name == "jump") { this.playerJumped = true; }
    }

    createModifier() {
        return new DoubleJumpModifier()
    }

}
