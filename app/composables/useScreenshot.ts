import { toPng } from 'html-to-image'

export function useScreenshot() {
  async function captureElement(element: HTMLElement, filename: string = 'dokabiliteetti.png'): Promise<void> {
    try {
      const dataUrl = await toPng(element, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--color-bg').trim() || '#FAFAFA'
      })

      // Create download link
      const link = document.createElement('a')
      link.download = filename
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Failed to capture screenshot:', error)
      throw error
    }
  }

  async function shareElement(element: HTMLElement, title: string = 'Dokabiliteetti'): Promise<void> {
    try {
      const dataUrl = await toPng(element, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--color-bg').trim() || '#FAFAFA'
      })

      // Convert data URL to blob
      const response = await fetch(dataUrl)
      const blob = await response.blob()
      const file = new File([blob], 'dokabiliteetti.png', { type: 'image/png' })

      // Try native share if available
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title,
          files: [file]
        })
      } else {
        // Fallback to download
        await captureElement(element)
      }
    } catch (error) {
      // User cancelled share or share not supported
      if ((error as Error).name !== 'AbortError') {
        console.error('Failed to share:', error)
        // Fallback to download
        await captureElement(element)
      }
    }
  }

  return {
    captureElement,
    shareElement
  }
}
