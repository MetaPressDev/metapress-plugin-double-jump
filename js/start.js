//
// My MetaPress Plugin

import packageJson from '../package.json'

export default class DoubleJumpPlugin {

    // Plugin information
    id              = packageJson.metapress?.id || packageJson.name
    name            = packageJson.metapress?.name || packageJson.name
    description     = packageJson.metapress?.description || packageJson.description
    version         = packageJson.version
    provides        = [ ]
    requires = ['entities', 'avatar']

    avatarController = null
    playerJumped = false;
    playerDoubleJumped = false;
    wasGrounded = false;
    /** Called on load */
    onLoad() {
        this.checkAvatarModifier()
    }

    $onEntityModifierLoad() {
        this.checkAvatarModifier()
    }

    checkAvatarModifier() {
        let modifier = metapress.entities.getModifier(metapress.avatar.currentUserEntity.id, 'avatar-controller')
        if (this.avatarController == modifier) return
        this.avatarController = modifier        
    }

    $onRender() {
        if (this.avatarController?.isGrounded) {this.playerJumped = false; this.playerDoubleJumped = false;}
    }

    $input_actionPressed(name){

        if(this.playerJumped && this.playerDoubleJumped == false && name == "jump"){
            this.playerDoubleJumped = true;console.log("playerDoubleJumped", name);
            this.avatarController.yVelocity = this.avatarController.entity.avatar_jumpHeight || 5
            this.avatarController.overrideAnimation({ animationStart: 'jump_start', animation: 'jump_loop', animationEnd: 'jump_end', interruptOnGround: true, pauseAtEnd: true })
        }
        if(name == "jump") {this.playerJumped = true;console.log("Jumped", name);}
        console.log("input_actionPressed 2", name)
    }

    $input_actionReleased(name){

        console.log("input_actionReleased 22", name)
    }
}