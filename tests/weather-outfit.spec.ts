import { expect, test } from '@playwright/test'

const rainyMissionHeading = /^오늘의 날씨: 비 오고 바람이 불어요$/
const umbrellaButton = /^.*우산$/
const rainBootsButton = /^.*장화$/
const windbreakerButton = /^.*바람막이$/

test('student can complete rainy outfit mission', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: rainyMissionHeading })).toBeVisible()

  await page.getByText('생활 수칙 보기').click()
  await expect(page.getByText('비 오는 날에는 발과 몸이 젖지 않도록 우산, 장화, 바람막이를 챙겨요.')).toBeVisible()

  await page.getByRole('button', { name: umbrellaButton }).click()
  await page.getByRole('button', { name: rainBootsButton }).click()
  await page.getByRole('button', { name: windbreakerButton }).click()
  await page.getByRole('button', { name: /^.*외출하기$/ }).click()

  await expect(page.getByRole('dialog')).toContainText('완벽한 외출 준비 끝!')
  await page.getByRole('button', { name: '다시 도전' }).click()
  await expect(page.getByRole('button', { name: /우산 빼기/ })).toHaveCount(0)
  await expect(page.getByRole('heading', { name: rainyMissionHeading })).toBeVisible()
})

test('layout keeps core controls visible on phone-sized viewport', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: rainyMissionHeading })).toBeVisible()
  await expect(page.getByRole('button', { name: '수업 모드 켜기' })).toBeVisible()
  await expect(page.getByRole('button', { name: umbrellaButton })).toBeVisible()
  await expect(page.getByRole('button', { name: /^.*외출하기$/ })).toBeVisible()
})
