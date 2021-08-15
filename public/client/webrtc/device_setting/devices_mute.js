class MuteManager {
    constructor(audio, video, localStream) {
        this.audio = audio,
        this.video = video,
        this.localStream = localStream
    }

    startAudio() {
        document.getElementById('audios').style.backgroundColor = '#545454';
        this.audio.style.backgroundColor = '#545454';
        this.audio.innerHTML = '<i class="fas fa-microphone"></i>';
        this.localStream.getAudioTracks().forEach(function(track) {
            track.enabled = true;
        });
    }

    startVideo() {
        document.getElementById('videos').style.backgroundColor = '#545454';
        this.video.style.backgroundColor = '#545454';
        this.video.innerHTML = '<i class="fas fa-video"></i>';
        this.localStream.getVideoTracks().forEach(function(track) {
            track.enabled = true;
        });
    }

    muteAudio() {
        document.getElementById('audios').style.backgroundColor = '#ea4435';
        this.audio.style.backgroundColor = '#ea4435';
        this.audio.innerHTML = '<i class="fas fa-microphone-slash"></i>';
        this.localStream.getAudioTracks().forEach(function(track) {
            track.enabled = false;
        });
    }

    enabledVideo() {
        document.getElementById('videos').style.backgroundColor = '#ea4435';
        this.video.style.backgroundColor = '#ea4435';
        this.video.innerHTML = '<i class="fas fa-video-slash"></i>';
        this.localStream.getVideoTracks().forEach(function(track) {
            track.enabled = false;
        });
    }
}

export function mute_audio(localVideo, localStream) {
    var audio_classes = localVideo.classList;
    var audio = audio_classes.toggle('fa-microphone');
    if (audio == true) {
        try {
            new MuteManager(
                document.getElementById('mu_audio'), 
                document.getElementById('mu_video'),
                localStream 
            ).startAudio();
        } catch {
            Swal.fire(
                '오디오를 활성화할 수 없습니다.',
                `오디오를 활성화할 수 없습니다. 다른 장치를 선택해주세요.`,
                'error'
            ).then(e =>{
                document.getElementById('mu_audio').innerHTML = '<i class="fas fa-microphone-slash"></i>';
            });
        }
    } else {
        try {
            new MuteManager(
                document.getElementById('mu_audio'), 
                document.getElementById('mu_video'),
                localStream 
            ).muteAudio();
        } catch {
            Swal.fire(
                '오디오를 활성화할 수 없습니다.',
                `오디오를 활성화할 수 없습니다. 다른 장치를 선택해주세요.`,
                'error'
            )
        }
    }
}

export function enabled_video(localVideo, localStream) {
    var video_classes = localVideo.classList;
    var video = video_classes.toggle('fa-video');
    if (video == true) {
        try {
            new MuteManager(
                document.getElementById('mu_audio'), 
                document.getElementById('mu_video'),
                localStream 
            ).startVideo();
        } catch {
            Swal.fire(
                '비디오를 킬 수 없습니다.',
                `비디오를 시작할 수 없습니다. 다른 장치를 선택해주세요.`,
                'error'
            ).then(e =>{
                document.getElementById('mu_video').innerHTML = '<i class="fas fa-video-slash"></i>';
            });
        }
    } else {
        try {
            new MuteManager(
                document.getElementById('mu_audio'), 
                document.getElementById('mu_video'),
                localStream 
            ).enabledVideo();
        } catch {
            Swal.fire(
                '비디오를 킬 수 없습니다.',
                `비디오를 시작할 수 없습니다. 다른 장치를 선택해주세요.`,
                'error'
            )
        }
    }
}