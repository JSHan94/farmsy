.taskCard {
  cursor: pointer;
  transition: box-shadow 0.15s ease-in-out;
  border-left-width: 4px;
}

.taskCard:hover {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

.cardContent {
  padding: 1rem;
  position: relative;
}

.linkButton {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: background-color 0.15s ease-in-out;
}

.linkButton:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.taskContent {
  padding-right: 2rem;
}

.taskTitle {
  margin-bottom: 0.5rem;
}

.taskDescription {
  color: var(--color-muted-foreground);
  font-size: 0.875rem;
}

.linkIcon {
  height: 1rem;
  width: 1rem;
  color: var(--color-muted-foreground);
}

/* Color variants */
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