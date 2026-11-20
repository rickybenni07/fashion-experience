import { Component } from 'react';

/** Se un modello GLB manca o è corrotto, mostra il fallback (modello procedurale) invece di rompere la scena. */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error) {
    if (import.meta.env?.DEV) console.warn('[OSSIDIANA] Modello non caricato, uso il fallback:', error?.message);
  }
  componentDidUpdate(prev) {
    if (prev.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: null });
  }
  render() {
    return this.state.error ? this.props.fallback ?? null : this.props.children;
  }
}
