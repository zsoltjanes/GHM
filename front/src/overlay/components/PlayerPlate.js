// @flow
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

import type { CurrentPlayer, AllPlayers } from '../types'
import type { State } from '../../types'

type Props = {
  playerData: CurrentPlayer,
  allPlayers: AllPlayers
}

class PlayerPlate extends PureComponent<Props> {
  render () {
    const { name, team, state, steamid } = this.props.playerData
    const { allPlayers } = this.props

    const isWatching = (this.props.playerData.spectarget !== undefined)

    if (allPlayers[steamid] === 0 || allPlayers[steamid] === undefined) return null
    const weapons = allPlayers[steamid].weapons
    const currentWeaponID = Object.keys(weapons).find(key => weapons[key].state === 'active')
    if (currentWeaponID === undefined) return null

    const currentWeapon = weapons[currentWeaponID]

    if (isWatching) {
      return (
        <div className={`player-plate ${team}`}>
          <div className='grid'>
            <div className='grid-upper'>
              <p>{name}</p>
            </div>
            <div className='grid-lower'>
              <div className='grid-lower-dark grid-hp'>
                <div className='item'>
                  <b>+</b>{state.health}
                </div>
                <div className='item'>
                  {state.helmet
                    ? (<img src='/static/utils/armor_helmet.svg' height='22px' />)
                    : (<img src='/static/utils/armor.svg' height='22px' />)
                  }{state.armor}
                </div>
              </div>
              <div className='grid-lower-light grid-stats'>
                7 3 2 91
              </div>
              <div className='grid-lower-dark grid-ammo'>
                <div className='item grenades'>
                  {Object.keys(weapons)
                    .filter(weapon => weapons[weapon].type === 'Grenade')
                    .map((grenade, index) => {
                      if (weapons[grenade].ammo_reserve === 2) {
                        return (
                          <div className='multiple-grenades' key={index}>
                            <div className='player-grenade'>
                              <img
                                src={`/static/weapons/${weapons[grenade].name}.svg`}
                                className={`weapon-wrap ${weapons[grenade].state === 'holstered' ? 'holstered' : ''}`}
                                height='24px'
                              />
                            </div>
                            <div className='player-grenade'>
                              <img
                                src={`/static/weapons/${weapons[grenade].name}.svg`}
                                className={`weapon-wrap ${weapons[grenade].state === 'holstered' ? 'holstered' : ''}`}
                                height='24px'
                              />
                            </div>
                          </div>
                        )
                      } else {
                        return (
                          <div className='player-grenade' key={index}>
                            <img
                              src={`/static/weapons/${weapons[grenade].name}.svg`}
                              className={`weapon-wrap ${weapons[grenade].state === 'holstered' ? 'holstered' : ''}`}
                              height='24px'
                            />
                          </div>
                        )
                      }
                    })
                  }
                </div>
                <div className='item'>
                  {currentWeapon.ammo_clip !== undefined ? (
                    <React.Fragment>
                      <span className='ammo-main'>{currentWeapon.ammo_clip}</span><span className='ammo-off'>/{currentWeapon.ammo_reserve}</span>
                    </React.Fragment>
                  ) : null
                  }
                </div>

              </div>
            </div>
            <div className='grid-add' />
          </div>
        </div>
      )
    } else {
      return (null)
    }
  }
}

const mapStateToProps = (state: State) => ({
  playerData: state.overlay.gameStatePlayer,
  allPlayers: state.overlay.gameStateAllPlayer
})

export default connect(mapStateToProps)(PlayerPlate)