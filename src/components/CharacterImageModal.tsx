import { useState } from "react"
import { X } from "lucide-react"
import styles from './CharacterImageModal.module.css'

interface CharacterImageModalProps {
  isOpen: boolean
  onClose: () => void
  onImageSelect: (imagePath: string) => void
  currentImage: string
}

interface MediaOption {
  path: string
  name: string
  type: 'video' | 'image'
}

export function CharacterImageModal({ isOpen, onClose, onImageSelect, currentImage }: CharacterImageModalProps) {
  const [selectedImage, setSelectedImage] = useState(currentImage)

  const availableImages: MediaOption[] = [
    { path: '/otter1.mp4', name: 'Otter 1', type: 'video' },
    { path: '/otter2.mp4', name: 'Otter 2', type: 'video' },
    { path: '/cat1.png', name: 'Cat 1', type: 'image' },
    { path: '/cat2.png', name: 'Cat 2', type: 'image' }
  ]

  const handleImageSelect = (imagePath: string) => {
    setSelectedImage(imagePath)
  }

  const handleConfirm = () => {
    onImageSelect(selectedImage)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Choose Your Character</h2>
          <button
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close modal"
          >
            <X className={styles.closeIcon} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <p className={styles.modalDescription}>
            Select a character for your profile:
          </p>

          <div className={styles.imageGrid}>
            {availableImages.map((image) => (
              <div
                key={image.path}
                className={`${styles.imageOption} ${selectedImage === image.path ? styles.selected : ''}`}
                onClick={() => handleImageSelect(image.path)}
              >
                <div className={styles.imageWrapper}>
                  {image.type === 'video' ? (
                    <video
                      src={image.path}
                      autoPlay
                      loop
                      muted
                      className={styles.characterImage}
                    />
                  ) : (
                    <img
                      src={image.path}
                      alt={image.name}
                      className={styles.characterImage}
                    />
                  )}
                  {selectedImage === image.path && (
                    <div className={styles.selectedOverlay}>
                      <div className={styles.checkmark}>✓</div>
                    </div>
                  )}
                </div>
                <p className={styles.imageName}>{image.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button
            onClick={onClose}
            className={styles.cancelButton}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className={styles.confirmButton}
          >
            Select Character
          </button>
        </div>
      </div>
    </div>
  )
}