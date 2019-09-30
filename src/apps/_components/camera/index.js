// @flow
import * as React from 'react';
class Camera extends React.Component<any, any> {
  static defaultProps: {
    audio: false,
    video: true,
    children: null
  };
  video: any;
  componentWillMount() {
    const { video, audio } = this.props;
    if (navigator.mediaDevices) {
      navigator.mediaDevices
        .getUserMedia({ video, audio })
        .then(mediaStream => {
          this.setState({ mediaStream });
          this.video.srcObject = mediaStream;
          this.video.play();
        })
        .catch(error => error);
    }
  }

  componentWillUnmount() {
    this.video.pause();
  }

  capture() {
    const mediaStreamTrack = this.state.mediaStream.getVideoTracks()[0];
    const imageCapture = new window.ImageCapture(mediaStreamTrack);

    return imageCapture.takePhoto();
  }

  pause() {
    this.video.pause();
  }

  resume() {
    this.video.play();
  }

  applyFilter(filter: string) {
    this.video.style.webkitFilter = filter;
  }

  render() {
    return (
      <div style={this.props.style || undefined} className="piramis-cam">
        {this.props.children}
        <video
          onClick={e => {
            this.props.onClick && this.props.onClick(e);
          }}
          style={styles.base}
          ref={video => {
            this.video = video;
          }}
        />
      </div>
    );
  }
}

export default Camera;

Camera.defaultProps = {
  audio: false,
  video: true,
  children: null
};
const styles = {
  base: {
    width: '100%',
    height: '100%'
  }
};
