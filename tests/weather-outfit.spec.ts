import { expect, test } from '@playwright/test'

const rainyMissionHeading = /^오늘의 날씨: 비 오고 바람이 불어요$/
const umbrellaButton = /^.*우산$/
const rainBootsButton = /^.*장화$/
const windbreakerButton = /^.*바람막이$/

test('student can complete rainy outfit mission', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: rainyMissionHeading })).toBeVisible()

  await page.getByRole('button', { name: umbrellaButton }).click()
  await page.getByRole('button', { name: rainBootsButton }).click()
  await page.getByRole('button', { name: windbreakerButton }).click()
  await page.getByRole('button', { name: /^.*외출하기$/ }).click()

  await expect(page.getByRole('dialog')).toContainText('완벽한 외출 준비 끝!')
})

test('layout keeps core controls visible on phone-sized viewport', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: rainyMissionHeading })).toBeVisible()
  await expect(page.getByRole('button', { name: umbrellaButton })).toBeVisible()
  await expect(page.getByRole('button', { name: /^.*외출하기$/ })).toBeVisible()
})
