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

    $ai_getKnowledgeBaseEntries = () => {
        return [
            {
                id: `${this.id}:addDoubleJumpSettings`,
                type: 'action',
                name: 'Add Double Jump Settings',
                tags: 'add double Jump, double jump settings, add settings, add double jump settings',
                content: `
                    Assistant instruction: Run this action when the user wants to add the double jump settings to the scene. If the user specifies height and amount, use input as an object with {jumpHeight: x, jumpAmount: y} Don't mention it otherwise. This is a developer feature, don't mention it to normal users.
                `,
                action: input => {
                    let json = JSON.parse(input)
                    console.log("input from action",json)
                    return this.addDoubleJumpSettings(input.jumpHeight||5, input.jumpAmount||1)
                }
            },
        ]
    }

    addDoubleJumpSettings() {
        try {


            // find the region object in the scene
            let region = metapress.entities.all.find(entity => entity.type == 'region')
            // if region not found, return an error
            if (!region) return 'Region not found, could not finish the action'
            // add the double jump settings to the region
            /*        metapress.entities.update(this.props.selectedEntityID, {
                ['modifier:' + modifier.id]: true
            })*/
            metapress.entities.update(region.id, {
                ['modifier:' + this.createModifier().id]: true
            })
        } catch (error) {
            console.warn('addDoubleJumpSettings:',error)
            return 'There was an error adding the Double Jump Settings'
        }
        // return success
        return 'Double Jump Settings added'
    }

    createModifier() {
        return new DoubleJumpModifier()
    }

}
