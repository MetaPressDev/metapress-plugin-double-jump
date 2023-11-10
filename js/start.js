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
    jumpHeldIn = false;
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
        console.log(this.avatarController)
    }
    loggedJump = false
    $onRender() {
        if(metapress.input?.actionActive('jump') && !this.loggedJump){
            console.log(metapress.input?.actionActive('jump'));
            this.loggedJump = true
        }
        if(!metapress.input?.actionActive('jump') && this.loggedJump){
            console.log(metapress.input?.actionActive('jump'));
            this.loggedJump = false
        }
        if(this.playerJumped && this.playerDoubleJumped == false && metapress.input?.actionActive('jump') && this.jumpHeldIn== false){
            this.playerDoubleJumped = true;
            this.avatarController.yVelocity = this.avatarController.entity.avatar_jumpHeight || 5
            this.avatarController.overrideAnimation({ animationStart: 'jump_start', animation: 'jump_loop', animationEnd: 'jump_end', interruptOnGround: true, pauseAtEnd: true })
        }
        if(this.wasGrounded && metapress.input?.actionActive('jump')) {this.playerJumped = true; this.wasGrounded=false;}
        if (this.avatarController?.isGrounded && this.wasGrounded == false) {this.wasGrounded = true; this.playerJumped = false; this.playerDoubleJumped = false;}
        this.jumpHeldIn = metapress.input?.actionActive('jump');
    }

}