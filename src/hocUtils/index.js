import { branch, renderNothing } from 'recompose'

export const renderNothingWhileTrue = isTrue => branch(isTrue, renderNothing)