.container {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.filterSection {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.filterGroup {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filterLabel {
  font-size: 0.875rem;
  color: var(--color-muted-foreground);
}

.filterSelect {
  width: 8rem;
}

.boardGrid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .boardGrid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .boardGrid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.column {
  height: fit-content;
}

.columnHeader {
  padding-bottom: 0.75rem;
}

.columnTitle {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.taskCount {
  font-size: 0.875rem;
  background-color: var(--color-muted);
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
}

.columnContent {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.filterOption {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filterColorSwatch {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 0.25rem;
}

.colorBlue {
  background-color: rgb(239 246 255);
  border-color: rgb(191 219 254);
}

.colorGreen {
  background-color: rgb(240 253 244);
  border-color: rgb(187 247 208);
}

.colorYellow {
  background-color: rgb(254 252 232);
  border-color: rgb(254 240 138);
}

.colorPurple {
  background-color: rgb(250 245 255);
  border-color: rgb(221 214 254);
}

.colorPink {
  background-color: rgb(253 242 248);
  border-color: rgb(251 207 232);
}

.colorGray {
  background-color: rgb(249 250 251);
  border-color: rgb(209 213 219);
}